// LIBS ----------------------------------------------------------------------------------------------------------------
const jwt = require("jsonwebtoken");

// LOCAL ---------------------------------------------------------------------------------------------------------------
const   db = require('../../../utils/db/database').promise(),
        { isEmail } = require("../../../utils/checkers/checkers"),
        { privateKey } = require("../../../utils/auth/rsaKeys"),
        sendMail = require("../../../utils/mailer/mail"),
        { timeLog, red, hl } = require("../../../utils/server/coolTerminal"),
        { tokenParser } = require("../../../utils/auth/tokenParser");

exports.vSend = async function (req, res) {

    let email;

    // IF USER WANTS A NEW EMAIL => THE EMAIL ADDRESS IS IN THE TOKEN, IN THE HEADER
    if (req.path === '/verify/resend') {
        let token = tokenParser(req, 'header');

        if (token.error) {
            return res.status(token.error.status).send(token);
        }

        else {
            email = token.email;
        }
    }

    // IF IT IS THE FIRST TIME AFTER REGISTRATION => THE TOKEN IS OBVIOUSLY IN BODY
    else {
        if (!req.body.email)
            return res.status(400).send({
                error: {
                    status: 400,
                    message: 'Email not set'
                }
            });

        if (!isEmail(req.body.email))
            return res.status(400).send({
                error: {
                    status: 400,
                    message: 'Invalid email'
                }
            });

        email = req.body.email;
    }

    // GET user
    let [check] =
        await db.query(
            'SELECT email, username, verified, id FROM users WHERE email = ?', [email]
        );

    // CHECKS IF USER EXISTS
    if (check.length === 0) {
        return res.status(404).send({
            error: {
                status: 404,
                message: 'User not found'
            }
        });
    }

    // CHECKS IF THE EMAIL IS ALREADY VERIFIED
    if (check[0].verified === 1)
        return res.status(403).send({
            error: {
                status: 404,
                message: 'Already verified email'
            }
        });

    // GENERATES THE VERIFY TOKEN
    else {
        let token = jwt.sign(
            {
                id: check[0].id
            },
            privateKey,
            {
                algorithm: 'RS256',
                expiresIn: '24h'
            });

        sendMail('verify', token, email, check[0].username,
            (err, info) => {
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
                    console.log(
                        `${timeLog()} ${red('Server')}: Verification e-mail successfully sent to ${hl(email)}.`
                    );
                    if (req['justBeforeRegistered']) {
                        return res.status(200).send({
                            status: 200,
                            messages: [
                                'User successfully added',
                                `Verification e-mail sent to ${email}`
                            ]
                        });
                    }
                    else {
                        return res.status(200).send({
                            status: 200,
                            messages: `Verification e-mail sent to ${email}`
                        });
                    }
                }
            });
    }
}