const Orders = require("../models/orders");

const { Sequelize, Op } = require("sequelize");

exports.getAllOrders = async (req, res) => {
  try {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 0;
    const order = req.query.order || ["createdAt", "DESC"];

    const search = req.query.search;
    const state = req.query.state;

    const { rows, count } = await Orders.findAndCountAll({
      where: {
        [Op.and]: [
          state ? { id_state: state } : {},
          search ? { name: { [Op.like]: search } } : {},
        ],
      },
      offset,
      limit,
      order: [[Sequelize.col(order[0]), order[1]]],
    });

    return res.status(200).json({ data: rows, total: count });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Orders.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Encomenda não encontrada" });
    }

    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
