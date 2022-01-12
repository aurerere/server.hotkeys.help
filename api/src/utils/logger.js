exports.logger = function (req, res, next) {
    const colors = {
        GET: '\u001b[34mGET',
        PUT: 'u001b[36mPUT',
        DELETE: '\u001b[31mDELETE',
        POST: '\u001b[32;1mPOST',
        grey: '\33[90;1m'
    }
    let d = new Date(Date.now()).toString();
    if (req.user) {
        console.log(`${colors["grey"]}[${d}] \u001b[32m${req.user.username}\u001b[0m: ${colors[req.method]} \u001b[0m${req.path}`)
    }
    else {
        console.log(`${colors["grey"]}[${d}] \u001b[33mGuest\u001b[0m: ${colors[req.method]} \u001b[0m${req.path}`)
    }
    next();
}