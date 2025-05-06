const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "2eha8.h.filess.io",
    user: "Project_drawnusing",
    password: "LoveTomas",
    database: "Project_drawnusing",
    port: 3307
});

module.exports = connection 