const mysql = require('mysql2');

// createConnection是沒有包含promise功能的方法，creatPoll有包含
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    // user: 'test',
    // password: 'T1st@localhost',
    database: 'proj57',
    waitForConnections: true,
    connectionLimit: 10, // 最大連線數
    queueLimit: 0
});

module.exports = pool.promise();
