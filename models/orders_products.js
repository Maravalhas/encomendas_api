const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utilities/connection");

const Orders = require("./orders");
const Products = require("./products");

class OrdersProducts extends Model {}

OrdersProducts.init(
  {
    quantity: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
  },
  {
    sequelize,
    tableName: "orders",
  }
);

OrdersProducts.belongsTo(Orders, { foreignKey: "id_order" });
Orders.hasMany(OrdersProducts, { foreignKey: "id_order" });

OrdersProducts.belongsTo(Products, { foreignKey: "id_product" });
Products.hasMany(OrdersProducts, { foreignKey: "id_product" });

module.exports = OrdersProducts;
