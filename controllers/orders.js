const Orders = require("../models/orders");
const OrdersProducts = require("../models/orders_products");
const OrdersStates = require("../models/orders_states");
const Products = require("../models/products");
const ShippingMethods = require("../models/shipping_methods");

const { Sequelize, Op } = require("sequelize");
const moment = require("moment");

exports.getAllOrders = async (req, res) => {
  try {
    const { offset, limit, order, search, state } = req.query;

    const { rows, count } = await Orders.findAndCountAll({
      attributes: [
        "id",
        "name",
        "address",
        "zipcode",
        "locality",
        "date_shipped",
        "date_received",
        "created_at",
        "id_shipping_method",
        [Sequelize.col("ShippingMethod.name"), "shipping_method"],
        "id_state",
        [Sequelize.col("OrdersState.name"), "state"],
      ],
      where: {
        [Op.and]: [
          state ? { id_state: state } : {},
          search ? { name: { [Op.like]: search } } : {},
        ],
      },
      include: [
        {
          model: ShippingMethods,
          attributes: [],
        },
        {
          model: OrdersStates,
          attributes: [],
        },
      ],
      offset,
      limit,
      order: order ? [order] : [["id", "ASC"]],
    });

    return res.status(200).json({ data: rows, total: count });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Orders.findByPk(req.params.id, {
      attributes: [
        "id",
        "name",
        "address",
        "zipcode",
        "locality",
        "date_shipped",
        "date_received",
        "created_at",
        "id_shipping_method",
        [Sequelize.col("ShippingMethod.name"), "shipping_method"],
      ],
      include: [
        {
          model: OrdersProducts,
          attributes: ["quantity", "price", "id_product"],
          include: [
            {
              model: Products,
              attributes: [],
            },
          ],
        },
        {
          model: ShippingMethods,
          attributes: [],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Encomenda não encontrada" });
    }

    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { name, address, zipcode, locality, id_shipping_method, products } =
      req.body;

    const shippingMethod = await ShippingMethods.findByPk(id_shipping_method, {
      attributes: ["id"],
      where: { active: 1 },
      raw: true,
    });

    if (!shippingMethod) {
      return res.status(400).json({ message: "Invalid shipping method" });
    }

    const allProducts = await Products.findAll({
      where: { id: products.map((product) => product.id_product) },
      raw: true,
    });

    if (allProducts.length !== products.length) {
      return res.status(403).json({ message: "Invalid products" });
    }

    Orders.create({
      name,
      address,
      zipcode,
      locality,
      id_shipping_method,
      created_by: req.user,
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    })
      .then((created) => {
        OrdersProducts.bulkCreate(
          products.map((product) => {
            const currentProduct = allProducts.find(
              (product2) => product2.id === product.id_product
            );
            return {
              id_order: created.id,
              id_product: product.id_product,
              quantity: product.quantity,
              price: currentProduct.price,
            };
          })
        ).then(() => {
          return res
            .status(201)
            .json({ id: created.id, message: "Order created successfully" });
        });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
