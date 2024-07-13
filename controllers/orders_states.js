const OrdersStates = require("../models/orders_states");

exports.getAllOrdersStates = async (req, res) => {
  try {
    const data = await OrdersStates.findAll({
      attributes: ["id", "name"],
      order: [["order", "ASC"]],
    });

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
