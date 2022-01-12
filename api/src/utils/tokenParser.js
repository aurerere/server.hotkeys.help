// LIBS ----------------------------------------------------------------------------------------------------------------
const jwt = require("jsonwebtoken");

// LOCAL ---------------------------------------------------------------------------------------------------------------
const   { privateKey } = require("../utils/rsaKeys"),
        { isToken } = require("./mess");

// ---------------------------------------------------------------------------------------------------------------------
/**
 * @param {$ObjMap} req
 * @return {$ObjMap}
 */
exports.tokenParser = function (req) {
    let auth = req.headers.authorization;

    // CHECKS IF THE TOKEN IS SET
    if(!auth || !auth.startsWith('Bearer') || !auth.split(' ')[1])
        return {
            error: {
                status: 403,
                message: 'You must provide a valid token'
            }
        };

    // TESTS THE TOKEN
    if (!isToken(auth.split(' ')[1]))
        return {
            error: {
                status: 403,
                message: 'You must provide a valid token'
            }
        };

    try {
        // PARSE THE TOKEN
        return jwt.verify(auth.split(' ')[1], privateKey, { algorithms: ['RS256'] });
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