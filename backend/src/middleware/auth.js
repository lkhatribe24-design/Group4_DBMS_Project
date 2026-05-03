// Simple role-based checking based on headers
// In a real app, use JWT or sessions. This matches the "simple login" requirement.

const requireUser = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: x-user-id required in headers.' });
    }
    req.user = { id: userId, role: 'user' };
    next();
};

const requireAdmin = (req, res, next) => {
    const adminId = req.headers['x-admin-id'];
    if (!adminId) {
        return res.status(401).json({ error: 'Unauthorized: x-admin-id required in headers.' });
    }
    req.admin = { id: adminId, role: 'admin' };
    next();
};

module.exports = { requireUser, requireAdmin };
