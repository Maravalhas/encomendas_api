const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utilities/connection");

const Products = require("./products");

class Logs extends Model {}

Logs.init(
  {
    title: DataTypes.STRING,
    text: DataTypes.TEXT,
    stock: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "products",
  }
);

Logs.belongsTo(Products, { foreignKey: "id_product" });
Products.hasMany(Logs, { foreignKey: "id_product" });

module.exports = Logs;
