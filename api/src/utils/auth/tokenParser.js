// LIBS ----------------------------------------------------------------------------------------------------------------
const jwt = require("jsonwebtoken");

// LOCAL ---------------------------------------------------------------------------------------------------------------
const   { privateKey } = require("./rsaKeys"),
        { isToken } = require("../checkers/checkers");

// ---------------------------------------------------------------------------------------------------------------------
/**
 * @param {$ObjMap} req
 * @param {'body' | 'header'} type
 * @return {$ObjMap}
 */
exports.tokenParser = function (req, type) {

    let token;

    if (type === 'header') {
        let auth = req.headers.authorization;
        // CHECKS IF THE TOKEN IS SET
        if(!auth || !auth.startsWith('Bearer') || !auth.split(' ')[1])
            return {
                error: {
                    status: 403,
                    message: 'You must provide a token'
                }
            };

        // TESTS THE TOKEN
        if (!isToken(auth.split(' ')[1]))
            return {
                error: {
                    status: 403,
                    message: 'You must provide a token'
                }
            };

        token = auth.split(' ')[1];
    }

    else if (type === 'body') {
        if (!req.body.token)
            return {
                error: {
                    status: 403,
                    message: 'You must provide a token'
                }
            };

        if (!isToken(req.body.token))
            return {
                error: {
                    status: 403,
                    message: 'You must provide a token'
                }
            };

        token = req.body.token;
    }

    try {
        // PARSE THE TOKEN
        return jwt.verify(token, privateKey, { algorithms: ['RS256'] });
    }

    catch (err) {
        if (err.toString() === 'TokenExpiredError: jwt expired')
            return {
                error: {
                    status: 403,
                    message: 'Expired token'
                }
            };
        else {
            return {
                error: {
                    status: 403,
                    message: 'Invalid token'
                }
            };
        }
    }
}