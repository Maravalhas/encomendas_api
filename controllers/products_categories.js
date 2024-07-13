const ProductsCategories = require("../models/products_categories");

const { Op } = require("sequelize");

exports.getAllProductsCategories = async (req, res) => {
  try {
    const { offset, limit, order, search, active } = req.query;

    const { rows, count } = await ProductsCategories.findAndCountAll({
      attributes: ["id", "name", "active"],
      where: {
        active: active || 1,
        ...(search ? { name: { [Op.like]: search } } : {}),
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
