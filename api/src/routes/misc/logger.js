// LOCAL ---------------------------------------------------------------------------------------------------------------
const { hl, red, timeLog, method } = require('../../utils/server/coolTerminal');

exports.logger = function (req, res, next) {

    if (req.user)
        console.log(
            `${timeLog()} ${hl(req.user.username)}(${req.socket.remoteAddress}): ${method[req.method]} ${req.path}`
        );

    else
        console.log(
            `${timeLog()} ${red('Guest')}(${req.socket.remoteAddress}): ${method[req.method]} ${req.path}`
        );


    next();
}