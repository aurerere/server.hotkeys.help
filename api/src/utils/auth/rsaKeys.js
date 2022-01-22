const fs = require('fs');

const privateKey = fs.readFileSync(__dirname + '../../../../jwt.key');

module.exports = { privateKey };

