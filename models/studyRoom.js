const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class StudyRoom extends Model {}

StudyRoom.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    roomName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    }
    // Add more fields as per your needs (like room description, capacity, etc.)
  },
  {
    sequelize,
    modelName: 'studyroom'
  }
);

module.exports = StudyRoom;
