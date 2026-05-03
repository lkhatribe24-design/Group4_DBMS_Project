-- ==============================================================================
-- 02_constraints.sql
-- Description: Adds Foreign Keys, CHECK constraints, UNIQUE constraints, 
--              and Indexes to the existing tables.
-- ==============================================================================

-- 1. Unique Constraints
ALTER TABLE Users ADD CONSTRAINT uq_users_email UNIQUE(Email);
ALTER TABLE Admin ADD CONSTRAINT uq_admin_email UNIQUE(Email);
ALTER TABLE Claim_Request ADD CONSTRAINT uq_claim_items UNIQUE(LostItem_ID, FoundItem_ID);

-- 2. Foreign Key Constraints
ALTER TABLE Lost_Item 
    ADD CONSTRAINT fk_lost_user FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE;

ALTER TABLE Found_Item 
    ADD CONSTRAINT fk_found_user FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE;

ALTER TABLE Claim_Request 
    ADD CONSTRAINT fk_claim_lost FOREIGN KEY (LostItem_ID) REFERENCES Lost_Item(LostItem_ID) ON DELETE CASCADE,
    ADD CONSTRAINT fk_claim_found FOREIGN KEY (FoundItem_ID) REFERENCES Found_Item(FoundItem_ID) ON DELETE CASCADE,
    ADD CONSTRAINT fk_claim_user FOREIGN KEY (Claimed_By) REFERENCES Users(User_ID) ON DELETE CASCADE,
    ADD CONSTRAINT fk_claim_admin FOREIGN KEY (Verified_By) REFERENCES Admin(Admin_ID) ON DELETE RESTRICT;

-- 3. Check Constraints (Domain Integrity)
ALTER TABLE Users 
    ADD CONSTRAINT chk_users_email_domain CHECK (
        Email LIKE '%@gmail.com' OR 
        Email LIKE '%@thapar.edu' OR 
        Email LIKE '%@outlook.com' OR 
        Email LIKE '%@yahoo.com'
    ),
    ADD CONSTRAINT chk_users_phone_format CHECK (Phone_No ~ '^[0-9\-\+\s\(\)]+$');

ALTER TABLE Admin 
    ADD CONSTRAINT chk_admin_email_domain CHECK (
        Email LIKE '%@gmail.com' OR 
        Email LIKE '%@thapar.edu' OR 
        Email LIKE '%@outlook.com' OR 
        Email LIKE '%@yahoo.com'
    ),
    ADD CONSTRAINT chk_admin_phone_format CHECK (Phone_No ~ '^[0-9\-\+\s\(\)]+$');

ALTER TABLE Lost_Item 
    ADD CONSTRAINT chk_lost_date CHECK (Lost_Date <= CURRENT_DATE),
    ADD CONSTRAINT chk_lost_status CHECK (Status IN ('Unclaimed', 'Pending', 'Claimed'));

ALTER TABLE Found_Item 
    ADD CONSTRAINT chk_found_date CHECK (Found_Date <= CURRENT_DATE),
    ADD CONSTRAINT chk_found_status CHECK (Status IN ('Unclaimed', 'Pending', 'Claimed'));

ALTER TABLE Claim_Request 
    ADD CONSTRAINT chk_claim_status CHECK (Verification_Status IN ('Pending', 'Approved', 'Rejected')),
    ADD CONSTRAINT chk_verification_admin CHECK (
        (Verification_Status = 'Pending' AND Verified_By IS NULL) OR 
        (Verification_Status IN ('Approved', 'Rejected') AND Verified_By IS NOT NULL)
    );

-- 4. Indexes (Optimization)
CREATE INDEX idx_lost_user ON Lost_Item(User_ID);
CREATE INDEX idx_found_user ON Found_Item(User_ID);
CREATE INDEX idx_claim_lost ON Claim_Request(LostItem_ID);
CREATE INDEX idx_claim_found ON Claim_Request(FoundItem_ID);
CREATE INDEX idx_claim_claimed_by ON Claim_Request(Claimed_By);

CREATE INDEX idx_pending_claims ON Claim_Request(Verification_Status) WHERE Verification_Status = 'Pending';
CREATE INDEX idx_unclaimed_lost ON Lost_Item(Status) WHERE Status = 'Unclaimed';
CREATE INDEX idx_unclaimed_found ON Found_Item(Status) WHERE Status = 'Unclaimed';

CREATE INDEX idx_lost_category_date ON Lost_Item(Category, Lost_Date);
CREATE INDEX idx_found_category_date ON Found_Item(Category, Found_Date);

CREATE INDEX idx_lost_name ON Lost_Item(Item_Name);
CREATE INDEX idx_found_name ON Found_Item(Item_Name);
