# Lost and Found Management System Database

This repository contains the PostgreSQL database schema, constraints, functions, triggers, and sample queries for the Lost and Found Management System. 

The project has been refactored into a clean, modular structure to separate concerns and ensure reliable execution.

## Project Structure

```
sql/
├── 01_schema.sql        # Creates base tables (no foreign keys/complex constraints)
├── 02_constraints.sql   # Adds foreign keys, unique rules, checks, and indexes
├── 03_functions.sql     # Stored PL/pgSQL functions for business logic
├── 04_triggers.sql      # Triggers for automated status updates and validation
├── 05_sample_data.sql   # Dummy data for testing the system
└── 06_queries.sql       # Complex matching queries and transaction examples
```

## How to Run (Step-by-Step)

To properly instantiate the database and avoid dependency issues, you must execute the files in chronological order.

### 1. Prerequisite
Create your PostgreSQL database (e.g., via `psql` or pgAdmin):
```sql
CREATE DATABASE lost_and_found;
\c lost_and_found;
```

### 2. Execution Order
From your terminal, execute the files in sequence:

```bash
# 1. Build the foundational tables
psql -d lost_and_found -f sql/01_schema.sql

# 2. Enforce strict relationships, domain integrity, and indexing
psql -d lost_and_found -f sql/02_constraints.sql

# 3. Load reusable stored functions
psql -d lost_and_found -f sql/03_functions.sql

# 4. Attach automation triggers to the tables
psql -d lost_and_found -f sql/04_triggers.sql

# 5. (Optional) Insert sample data for testing
psql -d lost_and_found -f sql/05_sample_data.sql

# 6. (Optional) Run sample analytical queries and transactions
psql -d lost_and_found -f sql/06_queries.sql
```

## Why This Structure?
* **Decoupling Creation from Constraints:** Extracting `ALTER TABLE` into `02_constraints.sql` ensures we never encounter "relation does not exist" errors when creating tables that might reference each other circularly.
* **Maintainability:** Triggers, Functions, and Schema definitions are isolated, making version control, debugging, and team collaboration significantly easier.
