// LIBS ----------------------------------------------------------------------------------------------------------------
const   app = require('express')(),
        cors = require('cors'),
        bodyParser = require('body-parser');

// LOCAL ---------------------------------------------------------------------------------------------------------------
const   { register } = require('./src/users/register'),
        { login } = require('./src/users/login'),
        { verify } = require('./src/users/verify'),
        { getUser } = require('./src/users/getUser'),
        pwChange = require('./src/users/pwChange'),
        { logger } = require('./src/utils/logger');

// APP -----------------------------------------------------------------------------------------------------------------
const port = require('../config.json').api.server.port;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// AUTH ----------------------------------------------------------------------------------------------------------------
app.route('/register')
    .post(logger, register);

app.route('/login')
    .post(logger, login)

app.route('/verify/:token')
    .get(logger, verify)

app.route('/me')
    .get(getUser, logger, (req, res) => {
       res.status(200).send({
           status: 200,
           message: `${req.user.username} successfully reached`,
           user: req.user
       });
    });

app.route('/password-change')
    .get(logger, pwChange.getToken)
    .post(pwChange.reset)
    .put(getUser, pwChange.change)

// ROUTES --------------------------------------------------------------------------------------------------------------
app.route('/')
    .get((req, res) => {
        res.send('')
    })

// 4O4 -----------------------------------------------------------------------------------------------------------------
app.use((req, res) => {
    res.status(404).send({
        error: {
                status: 404,
                message: 'Not Found'
            }
    });
});

// SERVER STARTUP ------------------------------------------------------------------------------------------------------
app.listen(port, () =>
    console.log(`API is running on http://localhost:${port}`)
);