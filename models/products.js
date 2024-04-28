const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utilities/connection");

const ProductsCategories = require("./products_categories");

class Products extends Model {}

Products.init(
  {
    name: DataTypes.STRING,
    stock: DataTypes.NUMBER,
    deleted: DataTypes.INTEGER(1),
  },
  {
    sequelize,
    tableName: "products",
  }
);

Products.belongsTo(ProductsCategories, { foreignKey: "id_category" });
ProductsCategories.hasMany(Products, { foreignKey: "id_category" });

module.exports = Products;
