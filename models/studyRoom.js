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
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'studyroom'
    }
);

StudyRoom.associate = function(models) {
    StudyRoom.hasMany(models.Chat, {
        onDelete: "cascade"
    });
};

module.exports = StudyRoom;
