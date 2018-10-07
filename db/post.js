'use strict'

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'postgres://postgres:postgres@localhost/weather',
    {
        logging: false,
        operatorsAliases: false
    });

const Post = sequelize.define('Post', {
    userId: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    timeStamp: {
        type: Sequelize.STRING
    }
    }, {
        freezeTableName: true,
    });

Post.sync();
module.exports = Post;