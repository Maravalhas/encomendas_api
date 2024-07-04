const ShippingMethods = require("../models/shipping_methods");

const { Op } = require("sequelize");

exports.getAllShippingMethods = async (req, res) => {
  try {
    const { limit, offset, order, state, search } = req.query;

    const { rows, count } = await ShippingMethods.findAndCountAll({
      where: {
        ...(state && { state }),
        ...(search && { name: { [Op.like]: search } }),
      },
      offset,
      limit,
      order: order ? [order] : [["id", "ASC"]],
      raw: true,
    });

    return res.status(200).json({ data: rows, total: count });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
