#!/usr/bin/env node
console.log('Hello, world!');

process.stdin.setEncoding('utf8');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
  
readline.question(`What's your name?`, (name) => {
    console.log(`Hi ${name}!`);
    readline.close();
});

console.log(process.argv);