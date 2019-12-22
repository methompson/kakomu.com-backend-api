const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.js');

// Login endpoint
router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const pass = req.body.password;

  return authController.authenticateUser(email, pass)
    .then((result) => {

      if (result === false){
        return res.status(401).send({});
      }

      // We should have a token, so we'll send it to the user
      return res.status(200).send({
        token: result,
        secret: global.jwtSecret,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send({});
    });
});

// Logout endpoint
router.post('/logout', (req, res, next) => {
  res.status(200).send({});
});

module.exports = router;