const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utilities/connection");

class Users extends Model {}

Users.init(
  {
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "users",
  }
);

module.exports = Users;
