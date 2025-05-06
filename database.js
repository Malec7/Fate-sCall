const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "2eha8.h.filess.io",
    user: "Project_drawnusing",
    password: "38975b8c040e44bd085c02bd7a5e5c8fe9e43912",
    database: "Project_drawnusing",
    port: 3307
});

module.exports = connection 