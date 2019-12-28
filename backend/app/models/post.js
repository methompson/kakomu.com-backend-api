const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const sql_connection = require('./connection.js');

class Post extends Model {};
Post.init({
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  content: Sequelize.TEXT,
  snippet: Sequelize.STRING,
  tags: {
    type: Sequelize.STRING,
  },
  published: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  datePublished: {
    type: Sequelize.DATE,
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
}, {
  sequelize: sql_connection,
  modelName: 'post',
});

module.exports = Post;