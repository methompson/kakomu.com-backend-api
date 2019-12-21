const express = require('express');

const router = express.Router();

// Login endpoint
router.post('/login', (req, res, next) => {
  res.status(200).send({});
});

// Logout endpoint
router.post('/logout', (req, res, next) => {
  res.status(200).send({});
});

module.exports = router;