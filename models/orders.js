const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utilities/connection");

const OrdersStates = require("./orders_states");
const ShippingMethods = require("./shipping_methods");

class Orders extends Model {}

Orders.init(
  {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    zipcode: DataTypes.STRING,
    locality: DataTypes.STRING,
    created_at: DataTypes.DATE,
    shipping_price: DataTypes.FLOAT,
    date_shipped: DataTypes.DATE,
    date_received: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "orders",
  }
);

Orders.belongsTo(OrdersStates, { foreignKey: "id_state" });
OrdersStates.hasMany(Orders, { foreignKey: "id_state" });

Orders.belongsTo(ShippingMethods, { foreignKey: "id_shipping_method" });
ShippingMethods.hasMany(Orders, { foreignKey: "id_shipping_method" });

module.exports = Orders;
