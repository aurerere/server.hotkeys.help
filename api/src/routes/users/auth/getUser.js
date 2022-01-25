// LOCAL ---------------------------------------------------------------------------------------------------------------
const   db = require('../../../utils/db/database').promise(),
        { tokenParser } = require('../../../utils/auth/tokenParser');

exports.getUser = async function (req, res, next) {

    try {

        let token = tokenParser(req, 'header');

        if (token.error) {
            return res.status(403).send(token);
        }

        // CHECKS IF TOKEN FORMAT IS OK
        if (!token.id || !token.password || !token.email) {
            return res.status(403).send({
                error: {
                    status: 403,
                    message: 'Invalid token'
                }
            });
        }

        // CHECKS THE TOKEN
        const [check] =
            await db.query(
                'SELECT id, username, email, profilePicture, perm, trustFactor, verified, banned ' +
                'FROM users WHERE id = ? AND password = ? AND email = ?',
                [token.id, token.password, token.email]
            );

        if (check.length > 0) {
            req.user = check[0];

            check[0]['verified'] = check[0].verified === 1;
            check[0]['banned'] = check[0].banned === 1;

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
                message: 'Internal server error'
            }
        });
    }
};