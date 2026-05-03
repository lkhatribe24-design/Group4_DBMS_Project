-- ==============================================================================
-- 03_functions.sql
-- Description: Contains stored functions for the application logic.
-- ==============================================================================

-- Function: Validate and Submit Claim securely
CREATE OR REPLACE FUNCTION submit_claim(
    p_lost_item_id INT,
    p_found_item_id INT,
    p_user_id INT
) RETURNS VOID AS $$
DECLARE
    v_lost_status VARCHAR;
    v_found_status VARCHAR;
    v_lost_owner INT;
BEGIN
    -- Check if lost item exists and get owner and status
    SELECT Status, User_ID INTO v_lost_status, v_lost_owner 
    FROM Lost_Item WHERE LostItem_ID = p_lost_item_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Lost Item % does not exist.', p_lost_item_id;
    END IF;

    -- Security / Integrity Validation: The user claiming must be the one who reported it lost
    IF v_lost_owner != p_user_id THEN
        RAISE EXCEPTION 'User % is not authorized to claim Lost Item %.', p_user_id, p_lost_item_id;
    END IF;

    -- Check if found item exists and get status
    SELECT Status INTO v_found_status 
    FROM Found_Item WHERE FoundItem_ID = p_found_item_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Found Item % does not exist.', p_found_item_id;
    END IF;

    -- State Validation: Items cannot be already claimed
    IF v_lost_status = 'Claimed' OR v_found_status = 'Claimed' THEN
        RAISE EXCEPTION 'One or both items have already been successfully claimed.';
    END IF;

    -- Check for an existing pending claim by this user for these items
    IF EXISTS (
        SELECT 1 FROM Claim_Request 
        WHERE LostItem_ID = p_lost_item_id 
          AND FoundItem_ID = p_found_item_id 
          AND Claimed_By = p_user_id
    ) THEN
        RAISE EXCEPTION 'A claim for these items has already been submitted by this user.';
    END IF;

    -- Insert claim request
    INSERT INTO Claim_Request (LostItem_ID, FoundItem_ID, Claimed_By, Verification_Status)
    VALUES (p_lost_item_id, p_found_item_id, p_user_id, 'Pending');

    -- Update item statuses to pending
    UPDATE Lost_Item SET Status = 'Pending' WHERE LostItem_ID = p_lost_item_id;
    UPDATE Found_Item SET Status = 'Pending' WHERE FoundItem_ID = p_found_item_id;

END;
$$ LANGUAGE plpgsql;
