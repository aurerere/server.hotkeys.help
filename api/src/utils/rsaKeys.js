const fs = require('fs');

// console.log(__dirname)
const privateKey = fs.readFileSync(__dirname + '../../../jwt.key');
// const publicKey = fs.readFileSync(__dirname + '..\..\..\jwt.key.pub');

module.exports = { privateKey,  /* publicKey */ };

