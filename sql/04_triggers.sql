-- ==============================================================================
-- 04_triggers.sql
-- Description: Contains trigger functions and triggers for automation and 
--              advanced validation.
-- ==============================================================================

-- Trigger Function: Real-time validation before inserting a claim
CREATE OR REPLACE FUNCTION validate_claim_before_insert()
RETURNS TRIGGER AS $$
DECLARE
    v_lost_date DATE;
    v_found_date DATE;
BEGIN
    -- Temporal Validation: Ensure Claim_Date is after the Lost and Found dates
    SELECT Lost_Date INTO v_lost_date FROM Lost_Item WHERE LostItem_ID = NEW.LostItem_ID;
    SELECT Found_Date INTO v_found_date FROM Found_Item WHERE FoundItem_ID = NEW.FoundItem_ID;
    
    IF DATE(NEW.Claim_Date) < v_lost_date OR DATE(NEW.Claim_Date) < v_found_date THEN
        RAISE EXCEPTION 'Claim date cannot be earlier than when the item was lost or found.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_claim_insert
BEFORE INSERT ON Claim_Request
FOR EACH ROW
EXECUTE FUNCTION validate_claim_before_insert();


-- Trigger Function: Cascade Claim Approval/Rejection
CREATE OR REPLACE FUNCTION update_status_on_claim_approval()
RETURNS TRIGGER AS $$
BEGIN
    -- Transition to Approved
    IF NEW.Verification_Status = 'Approved' AND OLD.Verification_Status != 'Approved' THEN
        -- 1. Update the actual items
        UPDATE Lost_Item SET Status = 'Claimed' WHERE LostItem_ID = NEW.LostItem_ID;
        UPDATE Found_Item SET Status = 'Claimed' WHERE FoundItem_ID = NEW.FoundItem_ID;
        
        -- 2. Reject ALL other pending claims that reference EITHER the lost or found item
        UPDATE Claim_Request 
        SET Verification_Status = 'Rejected',
            Verified_By = NEW.Verified_By -- Log which admin indirectly rejected them
        WHERE (LostItem_ID = NEW.LostItem_ID OR FoundItem_ID = NEW.FoundItem_ID) 
          AND Claim_ID != NEW.Claim_ID 
          AND Verification_Status = 'Pending';
          
    -- Transition to Rejected
    ELSIF NEW.Verification_Status = 'Rejected' AND OLD.Verification_Status = 'Pending' THEN
        -- Only revert Item Status to 'Unclaimed' if there are no OTHER 'Pending' claims for them
        IF NOT EXISTS (
            SELECT 1 FROM Claim_Request 
            WHERE LostItem_ID = NEW.LostItem_ID AND Claim_ID != NEW.Claim_ID AND Verification_Status = 'Pending'
        ) THEN
            UPDATE Lost_Item SET Status = 'Unclaimed' WHERE LostItem_ID = NEW.LostItem_ID;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM Claim_Request 
            WHERE FoundItem_ID = NEW.FoundItem_ID AND Claim_ID != NEW.Claim_ID AND Verification_Status = 'Pending'
        ) THEN
            UPDATE Found_Item SET Status = 'Unclaimed' WHERE FoundItem_ID = NEW.FoundItem_ID;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_claim_approval
AFTER UPDATE OF Verification_Status ON Claim_Request
FOR EACH ROW
EXECUTE FUNCTION update_status_on_claim_approval();
