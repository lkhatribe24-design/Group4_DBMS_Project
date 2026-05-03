# Lost and Found Management System Backend

This is the Node.js/Express backend for the Lost and Found Management System. It relies heavily on the PostgreSQL database constraints, triggers, and functions to handle business logic, ensuring extreme consistency.

## 📁 Folder Structure

```text
backend/
├── package.json
└── src/
    ├── app.js                    # Main application entry point
    ├── config/
    │   └── db.js                 # PostgreSQL connection pool setup
    ├── controllers/
    │   └── controller.js         # API logic (SQL queries execution)
    ├── middleware/
    │   └── auth.js               # Header-based role authentication
    └── routes/
        └── routes.js             # API endpoint definitions
```

## 🚀 Setup Instructions

1. **Prerequisites:** Ensure Node.js and PostgreSQL are installed. Ensure your database is initialized with the SQL scripts from the `/sql` directory.
2. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```
3. **Configure Database Variables:** 
   By default it connects to `localhost:5432` with user `postgres` and database `lost_and_found`. You can set environment variables to change this:
   ```bash
   export PG_USER=your_user
   export PG_PASSWORD=your_password
   export PG_DATABASE=lost_and_found
   ```
4. **Start Server:**
   ```bash
   npm start
   ```
   *The server will start on port 3000.*

---

## 🔗 API Documentation

> **Authentication Note:** This application uses simple header-based authentication as requested. 
> * For User routes, include header: `x-user-id: <User_ID>`
> * For Admin routes, include header: `x-admin-id: <Admin_ID>`

### 1. AUTH ROUTES

#### `POST /api/register`
Registers a new user. The database constraints validate the email domain strictly.
* **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@thapar.edu",
    "phone_no": "123-456-7890",
    "address": "Room 101, Girls Hostel"
  }
  ```
* **Success Response (201):**
  ```json
  {
    "message": "User registered",
    "user_id": 4
  }
  ```

#### `POST /api/login`
Logs in a user.
* **Request Body:**
  ```json
  { "email": "jane@thapar.edu" }
  ```
* **Success Response (200):**
  ```json
  {
    "message": "Login successful",
    "user_id": 4,
    "name": "Jane Doe"
  }
  ```

#### `POST /api/admin/login`
Logs in an administrator.
* **Request Body:**
  ```json
  { "email": "admin1@thapar.edu" }
  ```
* **Success Response (200):**
  ```json
  {
    "message": "Admin login successful",
    "admin_id": 1,
    "name": "Admin One"
  }
  ```

---

### 2. USER ROUTES (Requires `x-user-id` header)

#### `POST /api/lost`
Report a lost item.
* **Request Body:**
  ```json
  {
    "item_name": "Calculator",
    "category": "Electronics",
    "description": "Casio scientific calculator",
    "lost_location": "Library",
    "lost_date": "2024-05-01"
  }
  ```
* **Success Response (201):**
  ```json
  { "message": "Lost item reported", "lost_item_id": 3 }
  ```

#### `POST /api/found`
Report a found item.
* **Request Body:**
  ```json
  {
    "item_name": "Casio Calculator",
    "category": "Electronics",
    "description": "Found on a desk",
    "found_location": "Library 2nd Floor",
    "found_date": "2024-05-02"
  }
  ```
* **Success Response (201):**
  ```json
  { "message": "Found item reported", "found_item_id": 3 }
  ```

#### `GET /api/matches`
Retrieves potential matches by utilizing the relational JOIN query.
* **Success Response (200):**
  ```json
  {
    "matches": [
      {
        "lostitem_id": 3,
        "lost_item": "Calculator",
        "lost_date": "2024-05-01T00:00:00.000Z",
        "founditem_id": 3,
        "found_item": "Casio Calculator",
        "found_date": "2024-05-02T00:00:00.000Z",
        "finder_name": "Charlie Brown",
        "finder_contact": "charlie@thapar.edu"
      }
    ]
  }
  ```

#### `POST /api/claim`
Submits a claim. This offloads the logic to the `submit_claim` DB function.
* **Request Body:**
  ```json
  {
    "lost_item_id": 3,
    "found_item_id": 3
  }
  ```
* **Success Response (201):**
  ```json
  { "message": "Claim submitted successfully" }
  ```

---

### 3. ADMIN ROUTES (Requires `x-admin-id` header)

#### `GET /api/claims`
View all pending claims.
* **Success Response (200):**
  ```json
  {
    "pending_claims": [
      {
        "claim_id": 2,
        "claimed_by": "Jane Doe",
        "lost_item": "Calculator",
        "found_item": "Casio Calculator",
        "claim_date": "2024-05-03T10:00:00.000Z",
        "verification_status": "Pending"
      }
    ]
  }
  ```

#### `PUT /api/approve/:id`
Approves a claim. The database trigger automatically sets both items to "Claimed" and rejects competing claims.
* **Request (Params):** `PUT /api/approve/2`
* **Success Response (200):**
  ```json
  { "message": "Claim approved successfully" }
  ```

#### `PUT /api/reject/:id`
Rejects a claim. The database trigger safely restores the items to "Unclaimed" if no other claims exist.
* **Request (Params):** `PUT /api/reject/2`
* **Success Response (200):**
  ```json
  { "message": "Claim rejected" }
  ```
