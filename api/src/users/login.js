// LIBS ----------------------------------------------------------------------------------------------------------------
const   bcrypt = require('bcryptjs'),
        jwt = require('jsonwebtoken');

// LOCAL ---------------------------------------------------------------------------------------------------------------
const   db = require('../utils/database').promise(),
        mess = require('../utils/mess'),
        { privateKey } = require('../utils/rsaKeys');

// ---------------------------------------------------------------------------------------------------------------------

exports.login = async function (req, res)
{
    if (!req.body.identifier || !req.body.password)
        return res.status(400).send({
            error: {
                status: 400,
                message: 'Invalid Attributes',
            }
        });

    // CHECKS IF THE IDENTIFIER IS OK
    if (!mess.isEmail(req.body.identifier) && !mess.okUsername(req.body.identifier))
        return res.status(403).send({
            error: {
                status: 403,
                message: 'Invalid username or password.'
            }
        });

    try {
        let check;

        if (mess.isEmail(req.body.identifier))
            [check] = await db.query(
                'SELECT id, username, email, password FROM users WHERE email = ?', [req.body.identifier]);
        else
            [check] = await db.query(
                'SELECT id, username, email, password FROM users WHERE username = ?', [req.body.identifier]);


        // CHECKS IF ITS AN EXISTING ACCOUNT
        if (check.length <= 0)
            return res.status(403).send({
                error: {
                    status: 403,
                    message: 'Invalid username or password.'
                }
            });

        // CHECKS IF THE PASSWORD MATCHES
        if (!await bcrypt.compare(req.body.password, check[0].password))
            return res.status(403).send({
                error: {
                    status: 403,
                    message: 'Invalid username or password.'
                }
            });

        else {
            return res.status(200).send({
                status: 200,
                message: 'Successfully connected.',
                token: jwt.sign({id: check[0].id, password: check[0].password}, privateKey, { algorithm: 'RS256', expiresIn: '24h' })
            })
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
};