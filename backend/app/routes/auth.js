const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.js');

// Login endpoint
router.post('/login', (req, res, next) => {
  if (  !('email' in req.body) 
    ||  !('password' in req.body)
  ) {
    return res.status(401).send({
      message: "Required data not provided",
      error: "Required data not provided",
    });
  }
  next();
}, authController.authenticateUser);

router.post('/change-password', authController.authenticateToken, authController.updateUserPassword);

module.exports = router;