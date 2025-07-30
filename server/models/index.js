// server/models/index.js
const Sequelize = require('sequelize');
const db = {};

const config = require(__dirname + '/../config/config.json')["development"];

const sequelize = new Sequelize(
  config.database,
  config.username, 
  config.password, 
  config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User_info = require('./user_info')(sequelize, Sequelize.DataTypes);

module.exports = db;