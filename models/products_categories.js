const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utilities/connection");

class ProductsCategories extends Model {}

ProductsCategories.init(
  {
    name: DataTypes.STRING,
    deleted: DataTypes.INTEGER(1),
  },
  {
    sequelize,
    tableName: "products_categories",
  }
);

module.exports = ProductsCategories;
