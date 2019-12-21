const Sequelize = require('sequelize');

// Basic connection for now.
const sequelize = new Sequelize('blog_db', 'blog_user', 'blog_pw', {
    dialect: 'mysql',
    host: "db",
});

module.exports = sequelize;