// LIBS ----------------------------------------------------------------------------------------------------------------
const   bcrypt = require('bcryptjs'),
        crypto = require('crypto');

// LOCAL ---------------------------------------------------------------------------------------------------------------
const   db = require('../linker/database').promise(),
        mess = require('../mess'),
        config = require('../../../config.json'),
        sendMail = require('../linker/mail');
const jwt = require("jsonwebtoken");
const {privateKey} = require("../rsaKeys");

// ---------------------------------------------------------------------------------------------------------------------
exports.register = async function (req, res)
{
    if (!req.body.email || !req.body.username || !req.body.password) {
        return res.status(400).send({
            error: {
                status: 400,
                message: 'You must provide a valid email and define a password & username'
            }
        });
    }

    // TESTING THE INPUTS BEFORE TRIGGERING THE SQL SERVER
    let email = req.body.email.trim();
    let username = req.body.username.trim();

    let errors = [];
    // E-MAIL TEST
    if (!mess.isEmail(email) || email.length >= 100) errors.push('Invalid email format');
    // USERNAME TEST
    if (!mess.okUsername(username) || username.length < 3 || username.length >= 20)
        errors.push('Invalid username format');
    // PASSWORD TEST
    if (req.body.password.length <= 8) errors.push('Invalid password format');
    // RETURN 400 IF EMAIL || USERNAME || PASSWORD === INVALID
    if (errors.length !== 0)
        return res.status(400).send({
            error: {
                status: 400,
                'message(s)': errors
            }
        });

    try {
        // CHECKING IF THE E-MAIL IS ALREADY USED
        let [test] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
        if (test.length !== 0) errors.push('E-mail already in use.');

        // CHECKING IF THE USERNAME IS TAKEN
        [test] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
        if (test.length !== 0) errors.push('Username is taken');

        if (errors.length !== 0)
            return res.status(400).send({
                error: {
                    status: 400,
                    'message(s)': errors
                }
            });

        // PW BCRYPT HASH
        const hashedPw = await bcrypt.hash(req.body.password, config.api.bcrypt.seed);

        // VERIFY TOKEN
        let token = jwt.sign({ username }, privateKey, { algorithm: 'RS256', expiresIn: '24h' })

        // SENDING THE VERIFICATION E-MAIL
        sendMail('verify', token, email, username,
        async (err, info) => {
            if (err) {
                console.log(err)
                return res.status(500).send({
                    error: {
                        status: 500,
                        message: 'Server Internal error'
                    }
                })
            }
            else {
                // ADDING THE USER TO THE DB
                // console.log(info)
                token = await bcrypt.hash(token, config.api.bcrypt.seed)
                const [add] = await db.query
                ('INSERT INTO users(username, email, password, token) VALUES(?, ?, ?, ?)', [
                    username,
                    email,
                    hashedPw,
                    token
                ]);

                if (add.affectedRows === 1) {
                    return res.status(201).send({
                        success: {
                            status: 201,
                            message: 'User successfully added.'
                        }
                    })
                }
            }
        });
    }

    catch (err) {
        console.log(err)
        return res.status(500).send({
            error: {
                status: 500,
                message: 'Server Internal error'
            }
        });
    }
}