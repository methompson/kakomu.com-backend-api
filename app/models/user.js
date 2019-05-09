const Sequelize = require('sequelize');

const sequelize = require('../controllers/db.js');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    userType: {
        type: Sequelize.ENUM('admin', 'editor'),
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
    },
    passwordResetToken: Sequelize.STRING,
    passwordResetDate: Sequelize.DATE

});

module.exports = User;