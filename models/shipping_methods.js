const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utilities/connection");

class ShippingMethods extends Model {}

ShippingMethods.init(
  {
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    active: { type: DataTypes.INTEGER(1), defaultValue: 1 },
  },
  {
    sequelize,
    tableName: "shipping_methods",
  }
);

module.exports = ShippingMethods;
