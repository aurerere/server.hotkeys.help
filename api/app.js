// LIBS ----------------------------------------------------------------------------------------------------------------
const   express = require('express'),
        multer = require('multer'),
        cors = require('cors'),
        bodyParser = require('body-parser');

// LOCAL ---------------------------------------------------------------------------------------------------------------
const   { register } = require('./src/routes/users/auth/register'),
        { login } = require(  './src/routes/users/auth/login'),
        { verify } = require('./src/routes/users/verify/verify'),
        { getUser } = require('./src/routes/users/auth/getUser'),
        pwChange = require('./src/routes/users/update/pwChange'),
        { logger } = require('./src/routes/misc/logger'),
        { vSend } = require("./src/routes/users/verify/vSend");

// APP -----------------------------------------------------------------------------------------------------------------
const port = require('../config.json').api.server.port;

const   app = express(),
        storage = multer.memoryStorage(),
        upload = multer({ storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('./uploaded'));


// AUTH ----------------------------------------------------------------------------------------------------------------
app.route('/register')
    .post(logger, register, vSend);

app.route('/verify/resend')
    .get(getUser, logger, vSend)

app.route('/login')
    .post(logger, login);

app.route('/verify')
    .get(logger, verify);

app.route('/me')
    .get(getUser, logger, (req, res) => {
       res.status(200).send({
           status: 200,
           message: `${req.user.username} successfully reached`,
           user: req.user
       });
    });

app.route('/password/token')
    .get(logger, pwChange.getToken);

app.route('/password/update')
    .get(logger, pwChange.verifyToken)
    .post(logger, pwChange.reset)
    .put(getUser, logger, pwChange.change);


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
    console.log(`API is running on http://localhost:${port} | http://${require('ip').address()}:${port}`)
);