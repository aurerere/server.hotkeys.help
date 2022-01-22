const method = {
    GET: '\u001b[32mGET\u001b[0m', // GREEN
    POST: '\u001b[33mPOST\u001b[0m', // YELLOW
    PUT: '\u001b[34mPUT\u001b[0m', // BLUE
    DELETE: '\u001b[31mDELETE\u001b[0m' // RED
};

module.exports = {timeLog, hl, red, method};

function timeLog() {
    return '\33[90;1m[' + new Date().toString().replace(/\s(?=[^\s]*\()\((.*?)\)/, '') + ']\u001b[0m';
}

function hl(str) {
    return '\u001b[36m' + str + '\u001b[0m';
}

function red(str) {
    return '\u001b[31m' + str + '\u001b[0m';
}


