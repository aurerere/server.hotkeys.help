// LIBS ----------------------------------------------------------------------------------------------------------------
const { createConnection } = require('mysql2');

// LOCAL ---------------------------------------------------------------------------------------------------------------
const config = require('../../../config.json');

const db = createConnection({
    host: config.api.database.host,
    user: config.api.database.user,
    password: config.api.database.password,
    database: config.api.database.database,
    port: config.api.database.port,
});

module.exports = db;