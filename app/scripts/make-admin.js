#!/usr/bin/env node
const readline = require('readline');
const {Writable} = require('stream');
// const Writable = require('stream').Writable;;

const User = require('../models/user.js');

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

const data = {};

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
      chooseFirstName(instance, data, resolve);
    }
  });
}

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
      // console.log(`Please Choose a Password.\n`);
      instance.question(`Please Choose a Password.\n`, (password) => {
        data.password = password;
        resolve();
        mutableStdout.muted = false;
      });
      mutableStdout.muted = true;
    });
  })
  .then(() => {
    console.log("Name", data.firstName, data.lastName);
    console.log("Password", data.password);
    instance.close();
  });



// console.log(process.argv);