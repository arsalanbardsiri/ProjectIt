const Sequelize = require('sequelize');
const sequelize = require('../config/connection');

// Import models
const User = require('./user');
const StudyRoom = require('./studyRoom');

// Set up associations between models (if any)
// For example: User.hasMany(StudyRoom);
// This indicates one user can have many study rooms.

module.exports = {
  User,
  StudyRoom,
  sequelize
};
