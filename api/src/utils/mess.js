// EMAIL TEST-REGEX
/**
 * @param {string} email
 * @return {RegExpMatchArray}
 */
function isEmail (email) {
    return email.match(
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    );
}

// USERNAME TEST-REGEX
/**
 * @param {string} username
 * @return {RegExpMatchArray}
 */
function okUsername (username) {
    return username.match(
        /^[a-zA-Z\-_.1-9]+$/
    );
}

/**
 * @param {string} token
 * @return {RegExpMatchArray}
 */
function isToken (token) {
    return token.match(
        /(^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$)/
    )
}

module.exports = {okUsername, isEmail, isToken};