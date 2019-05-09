const Sequelize = require('sequelize');

const sequelize = require('../controllers/db.js');

const Post = sequelize.define('post', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    content: Sequelize.TEXT,
    snippet: Sequelize.STRING,
    tags: {
        type: Sequelize.STRING,
    },
    published:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    datePublished:{
        type: Sequelize.DATE,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
});

module.exports = Post;