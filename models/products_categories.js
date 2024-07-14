const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utilities/connection");

class ProductsCategories extends Model {}

ProductsCategories.init(
  {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    active: { type: DataTypes.INTEGER(1), defaultValue: 1 },
  },
  {
    sequelize,
    tableName: "products_categories",
  }
);

module.exports = ProductsCategories;
