const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../controllers/db.js');

/**
 * 
 * @param {*} req Express Request object
 * @param {*} res Express response object
 * @param {*} next Express next function
 */
const authenticateUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // We are looking for the user by their email address
  // We are creating a user variable in the function scope so that the
  // promise then statements can find it.
  let user;
  
  return new Promise((resolve, reject) => {
    pool.execute(`
      SELECT id, firstName, lastName, email, userType, password
      FROM users
      WHERE email = ?
    `,
    [email],
    (err, results, fields) => {
      resolve({
        err,
        results,
      });
    });
  })
    .then((result) => {
      // If no user exists, we return false and end everything
      if (result.err){
        throw {
          status: 500,
          message: "Server Error",
          error: "Database Server Error",
        };
      }

      if (result.results.length <= 0){
        throw {
          status: 401,
          message: "Invalid Credentials",
          error: "User Not Found",
        };
      }
      // We assign the user data to this variable so that we can use it later
      // in the logUserIn function.
      user = result.results[0];

      // We return the bcrypt compare instance to return a true/false statement
      return bcrypt.compare(password, user.password);
    })
    .then((result) => {
      // Result is a boolean tha that indicates if the comparison is correct.
      // if result is false, the password is incorrect. We respond with a 401 error.
      if (result !== true){
        throw {
          status: 401,
          message: "Invalid Credentials",
          error: "Invalid Credentials",
        };
      }

      const token = jwt.sign({
          email:      user.email,
          userId:     user.id,
          firstName:  user.firstName,
          lastName:   user.lastName,
          userType:   user.userType,
        },
        global.jwtSecret,
        { expiresIn: '2h' }
      );

      return res.status(200).send({
        token,
      });
    })
    .catch((err) => {
      return res.status(err.status).send({
        message: err.message,
        error: err.error,
      });
    });
};

/**
 * 
 * @param {Object} req Express Request object
 * @param {Object} res Express response object
 * @param {Function} next Express next function
 * 
 * This middleware checks for the existence of the authorization header, retrieves
 * the JWT from it and verifies it.
 */
const authenticateToken = (req, res, next) => {
  // Do we have the authorization header?
  // Is the authorization header structured correctly?
  if (  !('authorization' in req.headers)
    ||  req.headers.authorization.split(' ').length < 2
    ||  req.headers.authorization.split(' ')[0] != "Bearer"
  ){
    return res.status(401).send({
      message: "Authorization token not provided",
      error: "Authorization token not provided",
    });
  }

  const token = req.headers.authorization.split(' ')[1];
  
  jwt.verify(token, global.jwtSecret, (err, decoded) => {
    if (err){
      return res.status(401).send({
        message: "Invalid Token",
        error: "Invalid Token",
      });
    }

    req._user = decoded;

    next();
  });
};

module.exports = {
  authenticateUser,
  authenticateToken,
};