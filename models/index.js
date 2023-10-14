const Sequelize = require('sequelize');
const sequelize = require('../config/connection');

const User = require('./user');
const StudyRoom = require('./studyRoom');

// Associations
User.hasMany(StudyRoom, {
  foreignKey: 'userId',
  onDelete: 'CASCADE' // If a User is deleted, also delete associated StudyRooms.
});

StudyRoom.belongsTo(User, {
  foreignKey: 'userId'
});

module.exports = {
  User,
  StudyRoom,
  sequelize
};
