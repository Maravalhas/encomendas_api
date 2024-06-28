const moment = require("moment");
const Products = require("../models/products");
const ProductsCategories = require("../models/products_categories");

const { Op, Sequelize } = require("sequelize");

exports.getAllProducts = async (req, res) => {
  try {
    const { offset, limit, search, active } = req.query;

    const { count, rows } = await Products.findAndCountAll({
      attributes: [
        "id",
        "name",
        "price",
        "image",
        "id_category",
        [Sequelize.col("ProductsCategories.name"), "category"],
      ],
      where: {
        active: active || 1,
        ...(search ? { name: { [Op.like]: search } } : {}),
      },
      include: [
        {
          model: ProductsCategories,
          attributes: [],
        },
      ],
      offset,
      limit,
      raw: true,
    });

    return res.status(200).json({ data: rows, total: count });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, stock, price, id_category } = req.body;

    const category = await ProductsCategories.findByPk(id_category, {
      where: { attributes: ["id"], active: 1, raw: true },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    Products.create({
      name,
      price,
      stock,
      id_category,
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      created_by: req.user,
    })
      .then((product) => {
        return res.status(201).json({ data: product });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, stock, price, id_category } = req.body;

    const product = await Products.findByPk(id, {
      attributes: ["id"],
      raw: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const category = await ProductsCategories.findByPk(id_category, {
      where: { attributes: ["id"], active: 1, raw: true },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    Products.update(
      {
        name,
        price,
        stock,
        id_category,
        updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        updated_by: req.user,
      },
      { where: { id } }
    )
      .then((product) => {
        return res.status(200).json({ data: product });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
