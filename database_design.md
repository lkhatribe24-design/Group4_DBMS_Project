# Improved Lost and Found Management System Database Design

This document details the robust PostgreSQL database design, providing clear rationale for normal form compliance, strict data integrity enforcements, and indexing optimizations tailored for real-world scenarios.

## 1. Normalization: Strict 3NF Compliance

The schema rigidly follows the Third Normal Form (3NF) to eliminate anomalies and ensure optimal storage:

*   **First Normal Form (1NF):** 
    Every attribute is atomic. We store `Phone_No`, `Email`, and `Address` as scalar values. No tables contain multi-valued columns or repeating arrays.
*   **Second Normal Form (2NF):**
    All tables use non-composite surrogate primary keys (`SERIAL` keys like `LostItem_ID`). Because the Primary Key is a single column, partial dependencies are structurally impossible (every attribute is fully dependent on the entire PK).
*   **Third Normal Form (3NF):**
    There are absolutely no transitive dependencies (attributes that depend on other non-key attributes). 
    *   *Example:* The `Lost_Item` table correctly links to a user via `User_ID` without copying the user's `Name` or `Email`. If a user updates their email, it happens in exactly one place (`Users` table) and reflects globally.
    *   *Example:* The `Claim_Request` table stores `Verified_By` to track the Admin, instead of storing the Admin's name.

## 2. Ensuring Data Integrity (Edge Cases & Constraints)

The improved schema utilizes several layers of validation to ensure unbreakable data integrity:

### Domain Integrity
*   **Email & Phone Formats:** `CHECK (Email ~* '...')` and `CHECK (Phone_No ~ '...')` constraints ensure that only well-formed emails and numeric phone strings are accepted.
*   **Chronological Logic:** `CHECK (Lost_Date <= CURRENT_DATE)` and `CHECK (Found_Date <= CURRENT_DATE)` prevent users from claiming they lost or found an item in the future.
*   **Status Management:** Statuses are strictly limited to `('Unclaimed', 'Pending', 'Claimed')` and `('Pending', 'Approved', 'Rejected')`.

### Referential Integrity
*   **Cascades:** `ON DELETE CASCADE` ensures that if a User is deleted, their associated lost items, found items, and claim requests are automatically removed, preventing orphaned records.
*   **Restrictions:** `ON DELETE RESTRICT` is used on the `Verified_By` foreign key. An Admin cannot be deleted from the system if they have historically verified claims. This preserves the audit trail permanently.

### Semantic Integrity (Handling Nulls and Dependencies)
*   **Conditional Nullability:** The `chk_verification_admin` constraint enforces that `Verified_By` **must be `NULL`** when a claim is 'Pending', but **must not be `NULL`** when 'Approved' or 'Rejected'. This prevents an admin from being assigned to an unresolved claim, and ensures an audit trail exists for resolved ones.
*   **Duplicate Claim Prevention:** The `UNIQUE(LostItem_ID, FoundItem_ID)` constraint prevents spamming of identical requests between the same items.

## 3. Real-World Logic (Triggers and Functions)

To shift application logic to the secure database layer, the following mechanisms are deployed:

### `submit_claim` Function
Abstracts the claim creation into a single database call that handles complex security logic:
1.  Verifies both items actually exist.
2.  Ensures the `p_user_id` submitting the claim is the *actual owner* who originally reported the lost item.
3.  Checks that neither item is already 'Claimed' by someone else.
4.  Updates both items to 'Pending' immediately so others know it is under review.

### `validate_claim_before_insert` Trigger
Acts as an absolute chronological safety net before a claim is recorded. It temporally verifies that the `Claim_Date` is not impossibly earlier than the item's `Lost_Date` or `Found_Date`.

### `update_status_on_claim_approval` Trigger
Automates the resolution lifecycle with robust conflict resolution:
1.  **Approval Cascade:** When an admin approves a claim, it updates the associated `Lost_Item` and `Found_Item` to 'Claimed'.
2.  **Conflict Resolution:** It automatically finds *any other pending claims* that reference either of those claimed items and inherently rejects them, recording the same Admin as the rejector. 
3.  **Rejection Handling:** If a claim is rejected, it safely reverts the items to 'Unclaimed', but *only* if no other pending claims are actively waiting for those items.

## 4. Query Optimization (Indexing Strategy)

To maintain millisecond response times at scale, the database employs advanced indexing techniques:

*   **Foreign Key B-Trees:** `idx_lost_user`, `idx_found_user`, `idx_claim_lost`, `idx_claim_found` eliminate full-table scans during JOIN operations and cascading deletes.
*   **Partial Indexes:** 
    *   `idx_pending_claims` indexes *only* the rows where `Verification_Status = 'Pending'`. This ensures that Admin dashboards load instantly, even when there are millions of historical approved claims.
    *   `idx_unclaimed_lost` and `idx_unclaimed_found` do the same for the public "Find Matches" dashboard.
*   **Composite Indexes:** `(Category, Lost_Date)` optimally supports the matching query which routinely filters by category and proximity of dates.

---
*Refer to the updated `lost_and_found_schema.sql` for the complete execution script.*
