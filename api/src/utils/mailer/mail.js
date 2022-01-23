// LIBS ----------------------------------------------------------------------------------------------------------------
const { createTransport } = require('nodemailer');

// LOCAL ---------------------------------------------------------------------------------------------------------------
const config = require('../../../../config.json');

// INIT THE MAILER
const mail = createTransport({
    service: config.api.mail.service,
    auth: {
        user: config.api.mail.mail,
        pass: config.api.mail.password
    }
});

/**
 * @param {'verify' | 'resetPassword'} type
 * @param {string} token
 * @param {string} email
 * @param {string} username
 * @param {function} callback
 * @return {callback}
 */
function sendMail(type, token, email, username, callback) {
    if (type === 'verify') {
        mail.sendMail({
            from: config.api.mail.mail,
            to: email,
            subject: `hotkeys.help - please confirm your mail address`,
            html: `
            <!DOCTYPE HTML>
            <body style="font-family: sans-serif">
            <h4 style="font-size: 20px; margin-bottom: 0">Hello ${username},</h4><br>
            <p style="margin-top: 0">Thank you for trusting hotkeys.help.</p>
            <a href="#">
                <button style="outline: none; background: #0091BF; padding: 10px 14px 10px 14px; border-radius: 12px; border: none; cursor: pointer">
                    <p style="color: white; font-size: 15px; font-weight: bold; margin: 0">Confirm your email</p>
                </button>
            </a>
            <p style="margin-bottom: 0">Have a nice key,</p>
            <p style="margin-top: 2px">The hotkeys.help's bot</p>
            <p style="margin-top: 2px">${token}</p>
            </body>
            `
        },
        (err, info) => {
            if (!err) return callback(false, info);
            else return callback(err, false);
        });
    }

    else if (type === 'resetPassword') {
        mail.sendMail({
            from: config.api.mail.mail,
            to: email,
            subject: `hotkeys.help - Reset your password here`,
            html: `
            <!DOCTYPE HTML>
            <body style="font-family: sans-serif">
            <h4 style="font-size: 20px; margin-bottom: 0">Hello ${username},</h4><br>
            <a href="#">
                <button style="outline: none; background: #0091BF; padding: 10px 14px 10px 14px; border-radius: 12px; border: none; cursor: pointer">
                    <p style="color: white; font-size: 15px; font-weight: bold; margin: 0">Reset your password</p>
                </button>
            </a>
            <p style="margin-bottom: 0">Have a nice key,</p>
            <p style="margin-top: 2px">The hotkeys.help's bot</p>
            <p style="margin-top: 2px">${token}</p>
            </body>
            `
        },
        (err, info) => {
            if (!err) return callback(false, info);
            else return callback(err, false);
        });
    }
}


module.exports = sendMail;