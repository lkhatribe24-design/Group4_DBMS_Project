const pool = require('../config/db');

// --- AUTH ---

exports.register = async (req, res) => {
    const { name, email, phone_no, address } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Users (Name, Email, Phone_No, Address) VALUES ($1, $2, $3, $4) RETURNING User_ID',
            [name, email, phone_no, address]
        );
        res.status(201).json({ message: 'User registered', user_id: result.rows[0].user_id });
    } catch (err) {
        res.status(400).json({ error: 'Invalid operation' });
    }
};

exports.login = async (req, res) => {
    const { email } = req.body;
    try {
        const result = await pool.query('SELECT User_ID, Name FROM Users WHERE Email = $1', [email]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'Login successful', user_id: result.rows[0].user_id, name: result.rows[0].name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.adminLogin = async (req, res) => {
    const { email } = req.body;
    try {
        const result = await pool.query('SELECT Admin_ID, Name FROM Admin WHERE Email = $1', [email]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Admin not found' });
        res.json({ message: 'Admin login successful', admin_id: result.rows[0].admin_id, name: result.rows[0].name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- USER ---

exports.reportLost = async (req, res) => {
    const { item_name, category, description, lost_location, lost_date } = req.body;
    const user_id = req.user.id;
    try {
        const result = await pool.query(
            `INSERT INTO Lost_Item (User_ID, Item_Name, Category, Description, Lost_Location, Lost_Date) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING LostItem_ID`,
            [user_id, item_name, category, description, lost_location, lost_date]
        );
        res.status(201).json({ message: 'Lost item reported', lost_item_id: result.rows[0].lostitem_id });
    } catch (err) {
        res.status(400).json({ error: 'Invalid operation' });
    }
};

exports.reportFound = async (req, res) => {
    const { item_name, category, description, found_location, found_date } = req.body;
    const user_id = req.user.id;
    try {
        const result = await pool.query(
            `INSERT INTO Found_Item (User_ID, Item_Name, Category, Description, Found_Location, Found_Date) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING FoundItem_ID`,
            [user_id, item_name, category, description, found_location, found_date]
        );
        res.status(201).json({ message: 'Found item reported', found_item_id: result.rows[0].founditem_id });
    } catch (err) {
        res.status(400).json({ error: 'Invalid operation' });
    }
};

exports.getUserReports = async (req, res) => {
    const user_id = req.user.id;
    try {
        const lostItems = await pool.query(
            `SELECT LostItem_ID as id, Item_Name, Category, Lost_Date as date, Status, 'Lost' as type 
             FROM Lost_Item WHERE User_ID = $1`, [user_id]
        );
        const foundItems = await pool.query(
            `SELECT FoundItem_ID as id, Item_Name, Category, Found_Date as date, Status, 'Found' as type 
             FROM Found_Item WHERE User_ID = $1`, [user_id]
        );
        
        const allReports = [...lostItems.rows, ...foundItems.rows].sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json({ reports: allReports });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMatches = async (req, res) => {
    const user_id = req.user.id;
    try {
        // Advanced Match Query leveraging database relationships natively
        const result = await pool.query(`
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
                AND l.User_ID = $1
                AND f.Found_Date >= l.Lost_Date
                AND (f.Found_Date - l.Lost_Date) <= 30
        `, [user_id]);
        res.json({ matches: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.submitClaim = async (req, res) => {
    const { lost_item_id, found_item_id } = req.body;
    const user_id = req.user.id;
    try {
        await pool.query('SELECT submit_claim($1, $2, $3)', [lost_item_id, found_item_id, user_id]);
        res.status(201).json({ message: 'Claim submitted successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid operation' });
    }
};

exports.getUserClaims = async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await pool.query(`
            SELECT 
                cr.Claim_ID,
                cr.Claim_Date,
                cr.Verification_Status,
                l.Item_Name AS Lost_Item,
                f.Item_Name AS Found_Item,
                f.Found_Date
            FROM Claim_Request cr
            JOIN Lost_Item l ON cr.LostItem_ID = l.LostItem_ID
            JOIN Found_Item f ON cr.FoundItem_ID = f.FoundItem_ID
            WHERE cr.Claimed_By = $1
            ORDER BY cr.Claim_Date DESC;
        `, [user_id]);
        res.json({ claims: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- ADMIN ---

exports.getClaims = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                cr.Claim_ID, u_claimant.Name AS Claimed_By,
                l.Item_Name AS Lost_Item, f.Item_Name AS Found_Item,
                cr.Claim_Date, cr.Verification_Status
            FROM Claim_Request cr
            JOIN Users u_claimant ON cr.Claimed_By = u_claimant.User_ID
            JOIN Lost_Item l ON cr.LostItem_ID = l.LostItem_ID
            JOIN Found_Item f ON cr.FoundItem_ID = f.FoundItem_ID
            WHERE cr.Verification_Status = 'Pending'
            ORDER BY cr.Claim_Date DESC
        `);
        res.json({ pending_claims: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.approveClaim = async (req, res) => {
    const claim_id = req.params.id;
    const admin_id = req.admin.id;
    try {
        // Trigger update_status_on_claim_approval inside DB handles the rest
        const result = await pool.query(
            `UPDATE Claim_Request SET Verification_Status = 'Approved', Verified_By = $1 
             WHERE Claim_ID = $2 RETURNING Claim_ID`,
            [admin_id, claim_id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Claim not found or already processed' });
        res.json({ message: 'Claim approved successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid operation' });
    }
};

exports.rejectClaim = async (req, res) => {
    const claim_id = req.params.id;
    const admin_id = req.admin.id;
    try {
        // Trigger inside DB handles reverting items to unclaimed
        const result = await pool.query(
            `UPDATE Claim_Request SET Verification_Status = 'Rejected', Verified_By = $1 
             WHERE Claim_ID = $2 RETURNING Claim_ID`,
            [admin_id, claim_id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Claim not found or already processed' });
        res.json({ message: 'Claim rejected' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid operation' });
    }
};
