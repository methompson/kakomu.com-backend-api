// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'db',
//     user: 'blog',
//     database: 'blog',
//     password: 'blog',
// });

// module.exports = pool.promise();

const Sequelize = require('sequelize');

const sequelize = new Sequelize('blog', 'blog', 'blog', {
    dialect: 'mysql',
    host: "db",
});

module.exports = sequelize;