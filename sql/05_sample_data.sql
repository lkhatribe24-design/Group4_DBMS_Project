-- ==============================================================================
-- 05_sample_data.sql
-- Description: Inserts sample records to test the database structure.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Insert Users & Admins (Must be inserted first due to Foreign Keys)
-- ------------------------------------------------------------------------------

-- Insert Users (Using valid domains: @gmail.com, @thapar.edu)
INSERT INTO Users (Name, Email, Phone_No, Address) VALUES
('Alice Smith', 'alice@thapar.edu', '123-456-7890', '123 Campus Dr'),
('Bob Jones', 'bob.jones@gmail.com', '098-765-4321', '456 College Ave'),
('Charlie Brown', 'charlie@thapar.edu', '555-123-4567', '789 University Blvd');

-- Insert Admins (Using valid domain: @thapar.edu)
INSERT INTO Admin (Name, Email, Phone_No) VALUES
('Admin One', 'admin1@thapar.edu', '111-222-3333');


-- ------------------------------------------------------------------------------
-- 2. Insert Lost and Found Items
-- ------------------------------------------------------------------------------

-- Insert Lost Items
-- Alice (User 1) lost a laptop 5 days ago. 
-- Note: Setting status to 'Pending' because a claim will be created for it.
INSERT INTO Lost_Item (User_ID, Item_Name, Category, Description, Lost_Location, Lost_Date, Status) VALUES
(1, 'MacBook Pro', 'Electronics', 'Silver, stickers on back', 'Library', CURRENT_DATE - INTERVAL '5 days', 'Pending');

-- Bob (User 2) lost a wallet 2 days ago
INSERT INTO Lost_Item (User_ID, Item_Name, Category, Description, Lost_Location, Lost_Date, Status) VALUES
(2, 'Leather Wallet', 'Personal', 'Brown, contains ID', 'Cafeteria', CURRENT_DATE - INTERVAL '2 days', 'Unclaimed');

-- Insert Found Items
-- Charlie (User 3) found a laptop 4 days ago. 
-- Note: Setting status to 'Pending' because a claim will be created for it.
INSERT INTO Found_Item (User_ID, Item_Name, Category, Description, Found_Location, Found_Date, Status) VALUES
(3, 'Apple Laptop', 'Electronics', 'Silver MacBook with stickers', 'Library 2nd Floor', CURRENT_DATE - INTERVAL '4 days', 'Pending');

-- Alice (User 1) found keys 1 day ago
INSERT INTO Found_Item (User_ID, Item_Name, Category, Description, Found_Location, Found_Date, Status) VALUES
(1, 'Toyota Car Keys', 'Keys', 'Black keychain', 'Parking Lot A', CURRENT_DATE - INTERVAL '1 day', 'Unclaimed');


-- ------------------------------------------------------------------------------
-- 3. Insert Claim Requests (Must be inserted last)
-- ------------------------------------------------------------------------------

-- Alice (User 1) submits a claim for the laptop Charlie found (LostItem_ID=1, FoundItem_ID=1)
-- Security Integrity: Claimed_By = 1 (matches the owner of LostItem_ID 1).
-- Semantic Integrity: Verification_Status is 'Pending' and Verified_By is NULL.
INSERT INTO Claim_Request (LostItem_ID, FoundItem_ID, Claimed_By, Claim_Date, Verification_Status) VALUES
(1, 1, 1, CURRENT_TIMESTAMP, 'Pending');
