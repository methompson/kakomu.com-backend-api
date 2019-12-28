const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const sql_connection = require('./connection.js');

class User extends Model {};
User.init({
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
    unique: true,
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
  passwordResetDate: Sequelize.DATE,
}, {
  sequelize: sql_connection,
  modelName: 'user',
});

module.exports = User;