const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt'); // For password hashing

class User extends Model {
  // Method to check password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8] // Password should be at least 8 characters
      }
    }
  },
  {
    hooks: {
      // Before creating or updating a User, hash the password
      async beforeCreate(newUser) {
        newUser.password = await bcrypt.hash(newUser.password, 10);
        return newUser;
      },
      async beforeUpdate(updatedUser) {
        updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
        return updatedUser;
      }
    },
    sequelize,
    modelName: 'user'
  }
);

module.exports = User;
