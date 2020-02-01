const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'db',
  database: 'blog_db',
  user: 'blog_user',
  password: 'blog_pw',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;