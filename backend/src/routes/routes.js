const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const { requireUser, requireAdmin } = require('../middleware/auth');

// AUTH Routes
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/admin/login', controller.adminLogin);

// USER Routes
router.post('/lost', requireUser, controller.reportLost);
router.post('/found', requireUser, controller.reportFound);
router.get('/reports', requireUser, controller.getUserReports);
router.get('/matches', requireUser, controller.getMatches);
router.post('/claim', requireUser, controller.submitClaim);
router.get('/my-claims', requireUser, controller.getUserClaims);

// ADMIN Routes
router.get('/claims', requireAdmin, controller.getClaims);
router.put('/approve/:id', requireAdmin, controller.approveClaim);
router.put('/reject/:id', requireAdmin, controller.rejectClaim);

module.exports = router;
