const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utilities/connection");

class OrdersStates extends Model {}

OrdersStates.init(
  {
    name: DataTypes.STRING,
    key: DataTypes.STRING(1),
    shipped: DataTypes.INTEGER(1),
    received: DataTypes.INTEGER(1),
    order: DataTypes.INTEGER(1),
  },
  {
    sequelize,
    tableName: "orders_states",
  }
);

module.exports = OrdersStates;
