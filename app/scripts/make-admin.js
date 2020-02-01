#!/usr/bin/env node
const readline = require('readline');
const {Writable} = require('stream');
const bcrypt = require('bcryptjs');

const pool = require('../controllers/db.js');

process.stdin.setEncoding('utf8');

const mutableStdout = new Writable({
  write: function(chunk, encoding, callback){
    if (!this.muted){
      process.stdout.write(chunk, encoding);
    }
    callback();
  },
});

mutableStdout.muted = false;

const instance = readline.createInterface({
  input: process.stdin,
  // output: process.stdout
  output: mutableStdout,
  terminal: true,
});

function chooseFirstName(instance, data, resolve){
  instance.question(`What's the user's first name?\n`, (name) => {
    if (name.length > 0){
      data.firstName = name;
      resolve();
    } else {
      console.log("First Name is Required");
      chooseFirstName(instance, data, resolve);
    }
  });
}

function chooseLastName(instance, data, resolve){
  instance.question(`What's the user's last name?\n`, (name) => {
    if (name.length > 0){
      data.lastName = name;
      resolve();
    } else {
      console.log("Last Name is Required");
      chooseLastName(instance, data, resolve);
    }
  });
}

function choosePassword(instance, data, resolve, mutableStdout){
  // Reset the mute switch to false to show the first line
  mutableStdout.muted = false;

  instance.question(`Please choose a password.\n`, (password) => {
    // We want to enforce a password length
    if (password.length >= 8){
      // This unmutes the next section to confirm our passwords
      mutableStdout.muted = false;

      instance.question(`Please confirm your password.\n`, (passwordConf) => {
        if (passwordConf === password){
          data.password = password;

          // Unmuting for the final time
          mutableStdout.muted = false;
          resolve();
        } else {
          console.log("Passwords do not match.\n");
          choosePassword(instance, data, resolve, mutableStdout);
        }
      });

      // This mutes the second password input
      mutableStdout.muted = true;
    } else {
      console.log("Your password must be at least 8 characters long");
      choosePassword(instance, data, resolve, mutableStdout);
    }
  });
  // This sets the stdout to mute for the first password input line.
  mutableStdout.muted = true;
}

function chooseEmail(instance, data, resolve){
  instance.question(`What's the user's email address?\n`, (email) => {
    if (email.length > 0){
      data.email = email;
      resolve();
    } else {
      console.log("Last Name is Required");
      chooseEmail(instance, data, resolve);
    }
  });
}

const data = {};

return new Promise((resolve, reject) => {
  chooseFirstName(instance, data, resolve);
})
  .then(() => {
    return new Promise((resolve, reject) => {
      chooseLastName(instance, data, resolve);
    });
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      choosePassword(instance, data, resolve, mutableStdout);
    });
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      chooseEmail(instance, data, resolve);
    });
  })
  .then(() => {
    instance.close();
    return bcrypt.hash(data.password, 12);
  })
  .then((result) => {
    return new Promise((resolve, reject) => {
      pool.execute(
        `INSERT INTO users
        (firstName, lastName, email, userType, password)
        VALUES (?, ?, ?, ?, ?);`,
        [
          data.firstName,
          data.lastName,
          data.email,
          'admin',
          result,
        ],
        (err, results, fields) => {
          if (err){
            reject(err);
          }
          resolve(results);
        }
      );
    });
  })
  .then((results) => {
    console.log(results);
    // Sometimes the readline instance won't let the script close, so we end it
    // explicitly here.
    process.exit();
  })
  .catch((err) => {
    instance.close();
    console.log("Database Insert Error", err);
    process.exit();
  });