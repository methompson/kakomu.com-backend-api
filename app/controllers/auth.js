const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.js');

/**
 * 
 * @param {String} email 
 * @param {String} password 
 * 
 * Verify a user's credentials
 */
const authenticateUser = (email, password) => {
  // We are looking for the user by their email address
  let user;
  return User.findOne({
    where: {
      email,
    }
  })
    .then((result) => {
      // If no user exists, we return false and end everything
      if (!result){
        return false;
      }
      // We assign the user data to this variable so that we can use it later
      // in the logUserIn function.
      user = result.dataValues;

      // We return the bcrypt compare instance to return a true/false statement
      return bcrypt.compare(password, user.password);
    })
    .then((result) => {
      if (result){
        return false;
      }

      console.log(user);
      return logUserIn(user);
    });
};

/**
 * Generate the proper JWT token for the user and insert data into the database
 */
const logUserIn = (userData) => {
  return jwt.sign({
    email:      userData.email,
    userId:     userData.id,
    firstName:  userData.firstName,
    lastName:   userData.lastName,
    userType:   userData.userType,
  }, global.jwtSecret);
};

/**
 * Invalidate the JWT data
 */
const logUserOut = () => {};

module.exports = {
  authenticateUser,
  logUserIn,
  logUserOut,
};