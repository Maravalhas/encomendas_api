const ProductsCategories = require("../models/products_categories");

const { Op } = require("sequelize");

exports.getAllProductsCategories = async (req, res) => {
  try {
    const { offset, limit, order, search, active } = req.query;

    const { rows, count } = await ProductsCategories.findAndCountAll({
      attributes: ["id", "name", "description", "active"],
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

exports.createProductsCategories = async (req, res) => {
  try {
    const { name, description } = req.body;

    const duplicate = await ProductsCategories.findOne({
      attributes: ["id"],
      where: { name, active: 1 },
      raw: true,
    });

    if (duplicate) {
      return res
        .status(406)
        .json({ message: "Já existe uma categoria com este nome" });
    }

    ProductsCategories.create({ name, description })
      .then((created) => {
        return res
          .status(201)
          .json({ id: created, message: "Categoria criada com sucesso" });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateProductsCategories = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await ProductsCategories.findByPk(id, {
      attributes: ["id"],
      raw: true,
    });

    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    const duplicate = await ProductsCategories.findOne({
      attributes: ["id"],
      where: { name, active: 1, id: { [Op.ne]: id } },
      raw: true,
    });

    if (duplicate) {
      return res
        .status(406)
        .json({ message: "Já existe uma categoria com este nome" });
    }

    ProductsCategories.update({ name, description }, { where: { id } })
      .then(() => {
        return res
          .status(200)
          .json({ message: "Categoria atualizada com sucesso" });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteProductsCategories = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ProductsCategories.findByPk(id, {
      attributes: ["id"],
      raw: true,
    });

    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    ProductsCategories.update({ active: 0 }, { where: { id } })
      .then(() => {
        return res
          .status(200)
          .json({ message: "Categoria eliminada com sucesso" });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
