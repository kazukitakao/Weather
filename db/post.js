'use strict'

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/weather',
    {
        logging: false,
        operatorsAliases: false
    });

const Post = sequelize.define('userInfo', {
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