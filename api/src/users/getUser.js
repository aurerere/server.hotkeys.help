// LOCAL ---------------------------------------------------------------------------------------------------------------
const   db = require('../utils/database').promise(),
        { tokenParser } = require('../utils/tokenParser');


exports.getUser = async function (req, res, next) {

    try {

        let token = tokenParser(req);

        if (token.error) {
            return res.status(403).send(token)
        }

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
        return res.status(500).send({
            error: {
                status: 500,
                message: 'Internal server error',
                err: err
            }
        });
    }
};