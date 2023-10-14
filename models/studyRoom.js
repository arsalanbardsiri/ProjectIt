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
    // Additional fields can be added as needed.
  },
  {
    sequelize,
    modelName: 'studyroom'
  }
);

module.exports = StudyRoom;
