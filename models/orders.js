const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utilities/connection");

const OrdersStates = require("./orders_states");

class Orders extends Model {}

Orders.init(
  {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    shipped: DataTypes.INTEGER(1),
    date_shipped: DataTypes.DATE,
    received: DataTypes.INTEGER(1),
    date_received: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "orders",
  }
);

Orders.belongsTo(OrdersStates, { foreignKey: "id_state" });
OrdersStates.hasMany(Orders, { foreignKey: "id_state" });

module.exports = Orders;
