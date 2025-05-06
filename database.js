const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "aavec.h.filess.io",
    user: "Fates_exactbeeam",
    password: "830c6878858f95bfc87439f5528cec1d1a2c5ab4",
    database: "Fates_exactbeeam",
    port: 3307
});

module.exports = connection 