const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.js');

// Login endpoint
router.post('/login', authController.checkFailedLogins, authController.authenticateUser);

module.exports = router;