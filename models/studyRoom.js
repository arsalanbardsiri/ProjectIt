const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class StudyRoom extends Model {}

StudyRoom.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
        // ,
        // topic: {
        //     type: DataTypes.STRING,
        //     allowNull: false
        // },
        // description: {
        //     type: DataTypes.TEXT,
        //     allowNull: true
        // }
        
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'studyroom'
    }
);

module.exports = StudyRoom;
