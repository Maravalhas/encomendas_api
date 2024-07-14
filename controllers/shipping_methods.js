const ShippingMethods = require("../models/shipping_methods");

const { Op } = require("sequelize");

exports.getAllShippingMethods = async (req, res) => {
  try {
    const { limit, offset, order, search, active } = req.query;

    const { rows, count } = await ShippingMethods.findAndCountAll({
      where: {
        active: active || 1,
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

exports.createShippingMethod = async (req, res) => {
  try {
    const { name, price } = req.body;

    const duplicated = await ShippingMethods.findOne({
      attributes: ["id"],
      where: { name, active: 1 },
      raw: true,
    });

    if (duplicated) {
      return res.status(406).json({ message: "Método de envio já existe" });
    }

    ShippingMethods.create({
      name,
      price,
      active: 1,
    })
      .then((created) => {
        return res.status(201).json({
          message: "Método de envio criado com sucesso",
          id: created.id,
        });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateShippingMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    const existing = await ShippingMethods.findOne({
      attributes: ["id"],
      where: { id, active: 1 },
      raw: true,
    });

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Método de envio não encontrado" });
    }

    const duplicated = await ShippingMethods.findOne({
      attributes: ["id"],
      where: { name, active: 1, id: { [Op.ne]: id } },
      raw: true,
    });

    if (duplicated) {
      return res.status(406).json({ message: "Método de envio já existe" });
    }

    ShippingMethods.update(
      {
        name,
        price,
      },
      {
        where: { id },
      }
    )
      .then(() => {
        return res
          .status(200)
          .json({ message: "Método de envio atualizado com sucesso" });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteShippingMethod = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await ShippingMethods.findOne({
      attributes: ["id"],
      where: { id, active: 1 },
      raw: true,
    });

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Método de envio não encontrado" });
    }

    ShippingMethods.update(
      {
        active: 0,
      },
      {
        where: { id },
      }
    )
      .then(() => {
        return res
          .status(200)
          .json({ message: "Método de envio deletado com sucesso" });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
