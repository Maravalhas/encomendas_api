const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utilities/connection");

const Orders = require("./orders");
const Products = require("./products");

class OrdersProducts extends Model {}

/*
  discount_type === 1 : percentage
  discount_type === 2 : value
  discount_type === 3 : value / quantity
*/

OrdersProducts.init(
  {
    quantity: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    discount: DataTypes.FLOAT,
    discount_type: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "orders_products",
  }
);

OrdersProducts.belongsTo(Orders, { foreignKey: "id_order" });
Orders.hasMany(OrdersProducts, { foreignKey: "id_order" });

OrdersProducts.belongsTo(Products, { foreignKey: "id_product" });
Products.hasMany(OrdersProducts, { foreignKey: "id_product" });

module.exports = OrdersProducts;
