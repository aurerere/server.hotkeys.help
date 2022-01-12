// LIBS ----------------------------------------------------------------------------------------------------------------
const   jwt = require("jsonwebtoken"),
        { privateKey } = require("../rsaKeys");

// LOCAL ---------------------------------------------------------------------------------------------------------------
const db = require('../linker/database').promise();

exports.verify = async function (req, res)
{
    const token = jwt.verify(req.params.token, privateKey, { algorithms: ['RS256'] });

    if (!token.username)
        return res.status(404).send({
            error: {
                status: 404,
                message: 'User not found'
            }
        });

    const [verify] = await db.query('SELECT username, verified FROM users WHERE username = ?', [token.username]);

    // CHECKING IF USERNAME EXISTS
    if (verify.length === 0)
        return res.status(404).send({
            error: {
                status: 404,
                message: 'User not found'
            }
        });

    // CHECKING IF THE EMAIL WAS ALREADY VERIFIED
    if (verify[0]['verified'] !== 0)
        return res.status(403).send({
            error: {
                status: 403,
                message: 'Already verified email'
            }
        });

    else {
        const [update] =
            await db.query('UPDATE users SET verified = 1 WHERE username = ?', [token.username]);

        if (update.affectedRows === 1) {
            return res.status(200).send({
                status: 200,
                message: 'successfully verified email'
            })
        }
    }
}