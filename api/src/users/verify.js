// LIBS ----------------------------------------------------------------------------------------------------------------
const bcrypt = require('bcryptjs')

// LOCAL ---------------------------------------------------------------------------------------------------------------
const db = require('../linker/database').promise();

exports.verify = async function (req, res)
{
    let username = req.params.username;

    const [verify] = await db.query('SELECT username, token, verified FROM users WHERE username = ?', [username]);

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
        })

    let checked = await bcrypt.compare(req.params['token'], verify[0]['token']);

    // CHECKING IF THE MAIL TOKEN === DB TOKEN
    if (!checked)
        return res.status(401).send({
            error: {
                status: 401,
                message: 'Invalid token'
            }
        });

    else {
        const [update] =
            await db.query('UPDATE users SET verified = 1, token = "" WHERE username = ?', [username]);

        if (update.affectedRows === 1) {
            return res.status(200).send({
                success: {
                    status: 200,
                    message: 'successfully verified email'
                }
            })
        }
    }
}