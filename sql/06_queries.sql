-- ==============================================================================
-- 06_queries.sql
-- Description: Complex queries for searching, matching, and transacting.
-- ==============================================================================

-- 1. MATCHING QUERY: Find potential matches based on Category and date proximity
SELECT 
    l.LostItem_ID, l.Item_Name AS Lost_Item, l.Lost_Date, 
    f.FoundItem_ID, f.Item_Name AS Found_Item, f.Found_Date,
    u.Name AS Finder_Name, u.Email AS Finder_Contact
FROM 
    Lost_Item l
JOIN 
    Found_Item f ON l.Category = f.Category 
JOIN 
    Users u ON f.User_ID = u.User_ID
WHERE 
    l.Status = 'Unclaimed' AND f.Status = 'Unclaimed'
    AND f.Found_Date >= l.Lost_Date -- Item must be found on or after it was lost
    AND (f.Found_Date - l.Lost_Date) <= 30 -- Found within 30 days of being lost
    AND (l.Item_Name ILIKE '%' || f.Item_Name || '%' OR f.Item_Name ILIKE '%' || l.Item_Name || '%');


-- 2. CREATE A CLAIM (Using the function securely)
-- Alice claims that the laptop Charlie found is hers. 
-- (Assuming LostItem_ID=1 and FoundItem_ID=1, Alice is User_ID=1)
SELECT submit_claim(1, 1, 1);


-- 3. ADMIN VERIFYING A CLAIM (Using a transaction safely)
BEGIN;

-- Admin 1 approves the claim (Assuming the claim ID generated above is 1)
UPDATE Claim_Request 
SET Verification_Status = 'Approved', Verified_By = 1 
WHERE Claim_ID = 1;

-- The trigger `update_status_on_claim_approval` will automatically run here:
-- - Sets Lost_Item #1 to 'Claimed'
-- - Sets Found_Item #1 to 'Claimed'
-- - Rejects any other pending claims for Item #1

COMMIT;


-- 4. VIEW ALL ACTIVE CLAIMS WITH DETAILS
SELECT 
    cr.Claim_ID,
    u_claimant.Name AS Claimed_By,
    l.Item_Name AS Lost_Item,
    f.Item_Name AS Found_Item,
    cr.Claim_Date,
    cr.Verification_Status
FROM Claim_Request cr
JOIN Users u_claimant ON cr.Claimed_By = u_claimant.User_ID
JOIN Lost_Item l ON cr.LostItem_ID = l.LostItem_ID
JOIN Found_Item f ON cr.FoundItem_ID = f.FoundItem_ID
WHERE cr.Verification_Status = 'Pending'
ORDER BY cr.Claim_Date DESC;
