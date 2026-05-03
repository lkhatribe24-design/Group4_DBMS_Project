-- ==============================================================================
-- 01_schema.sql
-- Description: Creates the base tables for the Lost and Found Management System.
-- Note: Primary keys are defined here. Foreign keys and complex constraints
--       are defined in 02_constraints.sql to ensure proper execution order.
-- ==============================================================================

CREATE TABLE Users (
    User_ID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL,
    Phone_No VARCHAR(20),
    Address TEXT
);

CREATE TABLE Admin (
    Admin_ID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL,
    Phone_No VARCHAR(20)
);

CREATE TABLE Lost_Item (
    LostItem_ID SERIAL PRIMARY KEY,
    User_ID INT NOT NULL,
    Item_Name VARCHAR(150) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Description TEXT,
    Lost_Location VARCHAR(255),
    Lost_Date DATE NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Unclaimed'
);

CREATE TABLE Found_Item (
    FoundItem_ID SERIAL PRIMARY KEY,
    User_ID INT NOT NULL,
    Item_Name VARCHAR(150) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Description TEXT,
    Found_Location VARCHAR(255),
    Found_Date DATE NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Unclaimed'
);

CREATE TABLE Claim_Request (
    Claim_ID SERIAL PRIMARY KEY,
    LostItem_ID INT NOT NULL,
    FoundItem_ID INT NOT NULL,
    Claimed_By INT NOT NULL,
    Claim_Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Verification_Status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    Verified_By INT
);
