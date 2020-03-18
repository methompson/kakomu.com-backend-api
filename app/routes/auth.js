const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.js');

router.use(authController.checkFailedLogins);

// Login endpoint
router.post('/login', authController.authenticateUser);
router.post('/validate',
  authController.getTokenFromHeaders,
  authController.authenticateToken,
  (req, res, next) => {
    res.json({
      token: req._user,
    });
  }
);

module.exports = router;