const User = require('../models/user.js');

/**
 * 
 * @param {*} username 
 * @param {*} password 
 * 
 * Verify a user's credentials
 */
const authenticateUser = (username, password) => {};

/**
 * Generate the proper JWT token or the user and insert data into the database
 */
const logUserIn = () => {};

/**
 * Invalidate JWT data
 */
const logUserOut = () => {};

module.exports = {
  authenticateUser,
  logUserIn,
  logUserOut,
};