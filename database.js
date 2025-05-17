const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "xarcr.h.filess.io",
    user: "Fates_sitacresup",
    password: "c86c7ecf57e1093a8948e00ffae60fda8e68ca48",
    database: "Fates_sitacresup",
    port: 3307
});

module.exports = connection 