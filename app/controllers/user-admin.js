const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../controllers/db.js');
const {getUserById, makeJWTToken, checkUserPasswordById} = require('./auth.js');
const {makeError, makeErrorResponse, sendError, valsInBody} = require('./utilities.js');

function getAccountInfoList(){
  return {
    firstName:{
      dbName: 'firstName',
      unique: false,
      notNull: true,
      emptyOk: true,
      type: "string",
    },
    lastName:{
      dbName: 'lastName',
      unique: false,
      notNull: true,
      emptyOk: true,
      type: "string",
    },
    email:{
      dbName: 'email',
      unique: true,
      notNull: true,
      emptyOk: false,
      type: "string",
    },
  };
}

function makeUpdateList(req){
  const accountInfo = getAccountInfoList();

  const updateItems = [];

  Object.keys(accountInfo).forEach((key) => {
    if (key in req.body){
      const i = accountInfo[key];

      // If the type is string,
      // We check if notNull is false or true and the string isn't null
      // We check if the string can be empty and it's not or emptyOk is false
      if ( i.type === "string"
        && ( !i.notNull
          || (i.notNull && req.body[key] !== null))
        && ( i.emptyOk
          || (!i.emptyOk && req.body[key].length > 0)
        )
      ){
        updateItems.push(key);
      }
    }
  });

  return updateItems;
}

// We let the user update their account information including:
// * First Name
// * Last Name
// * Email Address
const updateUser = (req, res, next) => {

  // TODO Update the function to get the user first, then check the 
  // user's password against the db item.

  let updateItems;

  // Get the Promise chain started. We can use the catch block to send out
  // errors and reduce the amount of code to write.
  return new Promise((resolve, reject) => {
    // The user's id must be sent with the request
    // if (!('id' in req.body)){
    if( !valsInBody(req.body, ['id', 'password']) ){
      reject(makeError("Required Parameters Not Provided", "Required Parameters Not Provided", 400));
      return;
    }

    // We check if the updated user's id is the same as the one making the
    // request or if the user is an admin.
    if (req._user.userId !== req.body.id && req._user.userType !== 'admin'){
      reject(makeError("Unauthorized Access", "Unauthorized Access", 401));
      return;
    }

    // We make the list of information items we're updating, then check
    // that the list is populated with anything to update.
    updateItems = makeUpdateList(req);
    if (updateItems.length <= 0){
      reject(makeError("Nothing to Update", "No updatable parameters provided", 400));
      return;
    }
    resolve();
  })
    .then(() => {
      // After checking the parameters passed in the body, we check
      // the user's password.
      return checkUserPasswordById(req.body.id, req.body.password);
    })
    .then((result) => {
      // If the passwords don't match, we toss an error
      if (result !== true){
        throw makeError("Invalid Credentials", "Invalid Credentials", 401);
      }

      // We are free to update the database now. We will build an SQL query.
      let query = `
        UPDATE users
        SET `;
      const queryParams = [];

      const accountInfo = getAccountInfoList();
      for (let i=0, n=updateItems.length; i < n; ++i){
        // for each key, we're going to add a line to the query
        const key = updateItems[i];
        query += `${accountInfo[key].dbName} = ?`;
        // We're adding a comma to the end of each line, except the last one
        if (i !== n-1){
          query += ',';
        }
        // we add a new line
        query += `
        `;
        // We add the respective value associated with the line
        queryParams.push(req.body[key]);
      }
      
      query += 'WHERE id = ?';
      queryParams.push(req.body.id);

      return new Promise((resolve, reject) => {
        pool.execute(query, queryParams,
          (err, results, fields) => {
            if (err){
              reject(makeError("Database Server Error", err, 500));
              return;
            }

            if (results.affectedRows < 1){
              throw makeError("User Not Updated", "User Not Updated", 500);
            }

            resolve();
          });
      });
    })
    .then(() => {
      return getUserById(req._user.userId);
    })
    .then((user) => {
      // We make an expiration time thay is similar to the current expiration time
      // for the new JWT we're making
      const expires = req._user.exp - Math.ceil(Date.now() / 1000);
      const token = makeJWTToken(user, expires);
      
      res.status(200).json({
        message: "User Successfully Updated",
        token: token,
      });
    })
    .catch((err) => {
      const error = makeErrorResponse(err);
      sendError(error, res);
      return;
    });

};

// Step 1, see if we have everything we need
// Step 2, compare the user's token to the user from the id
// Step 2b, see if the user is an admin (they can change anyone)
// Step 3, get the user from the id.
// Step 4, check the user's password
// Step 5, update the database password
const updateUserPassword = (req, res, next) => {
  let user;

  return new Promise((resolve, reject) => {
    const reqVals = ['id', 'password', 'newPassword'];
    // valsInBody checks the object for the specified values and returns a boolean
    // indicating if the values exist.
    if ( !valsInBody(req.body, reqVals) ){
      reject(makeError("Password not updated", "Credentials Not Provided", 401));
      return;
    }

    resolve();
  })
    .then(() => {
      // We need to compare the user's old password to the current password
      return checkUserPasswordById(req.body.id, req.body.password);
    })
    .then((result) => {
      if (result !== true){
        throw makeError("Invalid Credentials", "Invalid Credentials", 401);
      }

      if (req._user.userId !== req.body.id && req._user.userType !== 'admin'){
        throw makeError("Password not updated", "Invalid User", 401);
      }

      return getUserById(req.body.id);
    })
    .then((result) => {
      // If we make it here, the user has been found in the database.
      user = result;

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
      // We've updated the password, we don't need to recalculate a token.
      // The password is not a part of the token.
      res.status(200).send({
        message: "Password Successfully Updated",
        results,
      });
    })
    .catch((err) => {
      const error = makeErrorResponse(err);
      sendError(error, res);
      return;
    });
};

module.exports = {
  updateUser,
  updateUserPassword,
};