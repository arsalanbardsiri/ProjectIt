module.exports = function(sequelize, DataTypes) {
    const Chat = sequelize.define("Chat", {
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });
  
    Chat.associate = function(models) {
      // Each chat message belongs to a user
      Chat.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      });
  
      // Each chat message belongs to a study room
      Chat.belongsTo(models.StudyRoom, {
        foreignKey: {
          allowNull: false
        }
      });
    };
  
    return Chat;
  };
  