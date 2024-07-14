const moment = require("moment");
const Products = require("../models/products");
const ProductsCategories = require("../models/products_categories");

const { Op, Sequelize } = require("sequelize");

exports.getAllProducts = async (req, res) => {
  try {
    const { offset, limit, order, search, active } = req.query;

    const { count, rows } = await Products.findAndCountAll({
      attributes: [
        "id",
        "name",
        "description",
        "price",
        "stock",
        "createdAt",
        "id_category",
        [Sequelize.col("ProductsCategory.name"), "category"],
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
      order: order ? [[Sequelize.col(order[0]), order[1]]] : [["id", "ASC"]],
      raw: true,
    });

    return res.status(200).json({ data: rows, total: count });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, stock, price, id_category } = req.body;

    const category = await ProductsCategories.findByPk(id_category, {
      where: { attributes: ["id"], active: 1, raw: true },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    Products.create({
      name,
      description,
      price,
      stock,
      id_category,
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
    const { name, description, stock, price, id_category } = req.body;

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
        description,
        price,
        stock,
        id_category,
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

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findByPk(id, {
      attributes: ["id"],
      raw: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    Products.update({ active: 0 }, { where: { id } })
      .then(() => {
        return res.status(200).json({ message: "Produto eliminado" });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
