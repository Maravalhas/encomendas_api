const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utilities/connection");

const ProductsCategories = require("./products_categories");
const Users = require("./users");

class Products extends Model {}

Products.init(
  {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    stock: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    active: { type: DataTypes.INTEGER(1), defaultValue: 1 },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "products",
  }
);

Products.belongsTo(ProductsCategories, { foreignKey: "id_category" });
ProductsCategories.hasMany(Products, { foreignKey: "id_category" });

Products.belongsTo(Users, { foreignKey: "created_by", as: "created" });
Users.hasMany(Products, { foreignKey: "created_by" });

Products.belongsTo(Users, { foreignKey: "updated_by", as: "updated" });
Users.hasMany(Products, { foreignKey: "updated_by" });

module.exports = Products;
