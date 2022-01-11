// LIBS ----------------------------------------------------------------------------------------------------------------
const jwt = require('jsonwebtoken');

// LOCAL ---------------------------------------------------------------------------------------------------------------
const   db = require('../linker/database').promise(),
        { privateKey } = require('../rsaKeys');


exports.getUser = async function (req, res, next) {

    try {
        let auth = req.headers.authorization
        // CHECKS IF THE TOKEN IS SET
        if(!auth || !auth.startsWith('Bearer') || !auth.split(' ')[1])
            return res.status(403).send({
                error: {
                    status: 403,
                    message: 'You need to provide a jwt'
                }
            });

        // PARSE THE TOKEN
        const token = jwt.verify(auth.split(' ')[1], privateKey, { algorithms: ['RS256'] });

        // CHECKS IF TOKEN FORMAT IS OK
        if (!token.id || !token.password) {
            return res.status(403).send({
                error: {
                    status: 403,
                    message: 'Invalid token'
                }
            });
        }

        // CHECKS THE TOKEN
        const [check] =
            await db.query('SELECT id, username, email, perm FROM users WHERE id = ? AND password = ?', [token.id, token.password])

        if (check.length > 0) {
            req.user = check[0]
            next();
        }
        else {
            return res.status(403).send({
                error: {
                    status: 403,
                    message: 'Invalid token'
                }
            });
        }
    }

    catch (err) {
        if (err.toString() === 'JsonWebTokenError: invalid token')
            return res.status(403).send({
                error: {
                    status: 403,
                    message: 'Invalid token'
                }
            });
        else if (err.toString() === 'TokenExpiredError: jwt expired')
            return res.status(403).send({
                error: {
                    status: 403,
                    message: 'Expired token'
                }
            });
        else {
            console.log(err)
            return res.status(500).send({
                error: {
                    status: 500,
                    message: 'Internal server error',
                    err: err
                }
            });
        }
    }
};