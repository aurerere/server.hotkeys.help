// LIBS ----------------------------------------------------------------------------------------------------------------
const   bcrypt = require('bcryptjs'),
        jwt = require("jsonwebtoken");

// LOCAL ---------------------------------------------------------------------------------------------------------------
const   db = require('../../utils/database').promise(),
        mess = require('../../utils/mess'),
        config = require('../../../../config.json'),
        sendMail = require('../../utils/mail'),
        { privateKey } = require('../../utils/rsaKeys'),
        { timeLog, hl, red } = require('../../utils/coolTerminal');

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
    if (!mess.isEmail(email) || email.length > 100) errors.push('Invalid email format');
    // USERNAME TEST
    if (!mess.okUsername(username) || username.length < 3 || username.length > 20)
        errors.push('Invalid username format');
    // PASSWORD TEST
    if (req.body.password.length < 8 || req.body.password.length > 100) errors.push('Invalid password format');
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
        let token = jwt.sign({ username }, privateKey, { algorithm: 'RS256', expiresIn: '24h' });

        // SENDING THE VERIFICATION E-MAIL
        sendMail('verify', token, email, username,
        async (err, info) => {
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
                // ADDING THE USER TO THE DB
                const [add] = await db.query
                ('INSERT INTO users(username, email, password) VALUES(?, ?, ?)', [
                    username,
                    email,
                    hashedPw,
                ]);

                if (add.affectedRows === 1) {
                    return res.status(201).send({
                        status: 201,
                        message: 'User successfully added.'
                    });
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