const fs = require('fs');

// console.log(__dirname)
const privateKey = fs.readFileSync(__dirname + '../../../../privateRsa.key');
// const publicKey = fs.readFileSync(__dirname + '..\..\..\privateRsa.key');

module.exports = { privateKey, /* publicKey */ };

