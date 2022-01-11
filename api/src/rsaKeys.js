const fs = require('fs')

const privateKey = fs.readFileSync(__dirname + '../../../privateRsa.key');
const publicKey = fs.readFileSync(__dirname + '../../../publicRsa.key.pem');

module.exports = { privateKey, publicKey };

