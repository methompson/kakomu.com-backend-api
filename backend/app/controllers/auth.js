const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../controllers/db.js');
const {makeError, makeErrorResponse, valsInBody} = require('./utilities.js');

// This function gets a user by Id and returns a promise
function getUserById(id){
  return new Promise((resolve, reject) => {
    // Get the user from the database based upon the id
    pool.execute(`
      SELECT id, firstName, lastName, email, userType, password
      FROM users
      WHERE id = ?
    `,
    [id],
    (err, results, fields) => {
      // If an error exists, we're going to throw it.
      if (err){
        reject(makeError("Password not updated", "Server Error", 500));
        return;
      }

      // If we have no reults, the user doesn't exist
      if (results.length < 1){
        reject(makeError("Password not updated", "User Not Found", 401));
        return;
      }

      // This is returning our user object
      resolve(results[0]);
    });
  });
}

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

const updateUser = (req, res, next) => {

};

// Step 1, see if we have everything we need
// Step 2, compare the user's token to the user from the id
// Step 2b, see if the user is an admin (they can change anyone)
// Step 3, get the user from the id.
// Step 4, check the user's password
// Step 5, update the database password
const updateUserPassword = (req, res, next) => {
  let user;
  const reqVals = ['id', 'oldPassword', 'newPassword'];

  console.log(req._user);

  return new Promise((resolve, reject) => {
    if ( !valsInBody(req.body, reqVals) ){
      reject(makeError("Password not updated", "Credentials Not Provided", 401));
      return;
    }

    resolve();
  })
    .then(() => {
      if (req._user.userId !== req.body.id && req._user.userType !== 'admin'){
        throw makeError("Password not updated", "Invalid User", 401);
      }

      return getUserById(req.body.id);
    })
    .then((result) => {
      // If we make it here, the user has been found in the database.
      // We need to compare the user's old password to the current password
      user = result;
      return bcrypt.compare(req.body.oldPassword, user.password);
    })
    .then((result) => {
      // If the passwords don't match, we throw another error
      if (result !== true){
        throw makeError("Password not updated", "Invalid Credentials", 401);
      }

      // We finally arrive at a point where we can update the password
      // We'll hash the password with bcrypt, then run the SQL query.
      return bcrypt.hash(req.body.newPassword, 12);
    })
    .then((result) => {
      return new Promise((resolve, reject) => {
        pool.execute(`
          UPDATE users
            SET password = ?
          WHERE id = ?
        `,
        [result, user.id],
        (err, results, fields) => {
          if (err){
            reject(makeError("Password not updated", "Database Error", 500));
            return;
          }

          resolve(results);
        });
      });
    })
    .then((results) => {
      res.status(200).send({
        message: "Password Successfully Updated",
        results,
      });
    })
    .catch((err) => {
      const error = makeErrorResponse(err);

      return res.status(error.status).json({
        error: error.error,
        message: error.message,
      });
    });
};

module.exports = {
  authenticateUser,
  authenticateToken,
  updateUser,
  updateUserPassword,
};