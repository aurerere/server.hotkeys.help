// LIBS ----------------------------------------------------------------------------------------------------------------
const   jwt = require('jsonwebtoken'),
        bcrypt = require('bcryptjs');

// LOCAL ---------------------------------------------------------------------------------------------------------------
const   { isEmail } = require('../../utils/mess'),
        db = require('../../utils/database').promise(),
        sendMail = require('../../utils/mail'),
        { privateKey } = require('../../utils/rsaKeys'),
        { tokenParser } = require('../../utils/tokenParser'),
        config = require('../../../../config.json');

// ---------------------------------------------------------------------------------------------------------------------
async function getToken(req, res) {
    if (!req.body.email)
        return res.status(400).send({
            error: {
                status: 400,
                message: 'You must provide a valid email'
            }
        });

    if (!isEmail(req.body.email))
        return res.status(400).send({
            error: {
                status: 400,
                message: 'You must provide a valid email'
            }
        });

    try {
        const [userCheck] = await db.query('SELECT username, id FROM users WHERE email = ?', [req.body.email]);

        if (userCheck.length === 0)
            return res.status(404).send({
                error: {
                    status: 404,
                    message: 'User not Found'
                }
            });

        else {
            let token = jwt.sign(
                {
                    username: userCheck[0].username,
                    id: userCheck[0].id,
                    email: req.body.email
                },
                privateKey,
                {
                    algorithm: 'RS256',
                    expiresIn: '30m'
                }, () => {});

            sendMail('resetPassword', token, req.body.email, userCheck[0].username, (err, info) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        error: {
                            status: 500,
                            message: 'Server Internal error'
                        }
                    });
                }
                else {
                    // console.log(timeLog() + ' \u001b[31mServer\u001b[0m: E-mail successfully sent to ' + highlight(req.body.email) + '.');
                    return res.status(200).send({
                        status: 200,
                        message: 'An email has been sent to reset the password'
                    });
                }
            });
        }
    }

    catch (err) {
        console.log(err);
        return res.status(500).send({
            error: {
                status: 500,
                message: 'Server Internal error'
            }
        });
    }
}

async function reset (req, res) {

    if (!req.body.password)
        return res.status(400).send({
            error: {
                status: 400,
                message: 'You need to provide a new password'
            }
        });

    // PARSES THE TOKEN
    let token = tokenParser(req, 'body');

    // IF tokenParser() CAUGHT AN ERROR
    if (token.error)
        return res.status(token.error.status).send(token);

    // CHECKS IF TOKEN FORMAT IS OK
    if (!token.id || !token.username || !token.email) {
        return res.status(403).send({
            error: {
                status: 403,
                message: 'Invalid token'
            }
        });
    }

    if (req.body.password.length < 8 || req.body.password.length > 100)
        return res.status(400).send({
            error: {
                status: 400,
                message: 'Invalid password format'
            }
        });

    let password = await bcrypt.hash(req.body.password, config.api.bcrypt.seed);

    try {
        const [getUser] = await db.query(
            'UPDATE users SET password = ? WHERE id = ? AND username = ? AND email = ?',
            [password, token.id, token.username, token.email]
        );

        if (getUser.affectedRows === 1)
            return res.status(200).send({
                status: 200,
                message: 'Password successfully updated'
            });

        else {
            return res.status(404).send({
                error: {
                    status: 404,
                    message: 'user not found'
                }
            });
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({
            error: {
                status: 404,
                message: 'user not found'
            }
        });
    }

}

function verifyToken (req, res) {
    let token = tokenParser(req, 'body');

    if (token.error)
        return res.status(token.error.status).send(token)

    if (!token.id || !token.username || !token.email) {
        return res.status(403).send({
            error: {
                status: 403,
                message: 'Invalid token'
            }
        });
    }

    else {
        return res.status(200).send({
            status: 200,
            message: 'ready to change'
        })
    }
}

async function change (req, res) {
    if (!req.body.password)
        return res.status(400).send({
            error: {
                status: 400,
                message: 'You need to provide a new password'
            }
        });

    if (req.body.password.length < 8 || req.body.password.length > 100)
        return res.status(400).send({
            error: {
                status: 400,
                message: 'Invalid password format'
            }
        });

    let password = await bcrypt.hash(req.body.password, config.api.bcrypt.seed);

    try {
        const [update] = db.query('UPDATE users SET password = ?', [password]);

        if (update.affectedRows === 1)
            return res.status(200).send({
                status: 200,
                message: 'Password successfully updated'
            });

        else {
            return res.status(404).send({
                error: {
                    status: 404,
                    message: 'user not found'
                }
            });
        }
    }

    catch (err) {
        console.log(err)
        return res.status(500).send({
            error: {
                status: 404,
                message: 'user not found'
            }
        });
    }
}

module.exports = { getToken, reset, change, verifyToken };