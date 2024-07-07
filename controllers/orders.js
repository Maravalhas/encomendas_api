const Orders = require("../models/orders");
const OrdersProducts = require("../models/orders_products");
const OrdersStates = require("../models/orders_states");
const Products = require("../models/products");
const ShippingMethods = require("../models/shipping_methods");

const { Sequelize, Op } = require("sequelize");
const moment = require("moment");

exports.getAllOrders = async (req, res) => {
  try {
    const { offset, limit, order, search, state, products, date } = req.query;

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
        [Sequelize.col("OrdersState.key"), "state_key"],
      ],
      where: {
        [Op.and]: [
          state ? { id_state: state } : {},
          search ? { name: { [Op.like]: search } } : {},
          date ? { created_at: { [Op.gte]: date } } : {},
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
        ...(products
          ? [
              {
                model: OrdersProducts,
                attributes: ["quantity", "price"],
              },
            ]
          : []),
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
          attributes: [
            "quantity",
            "price",
            "id_product",
            "discount",
            "discount_type",
          ],
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

    const pendingState = await OrdersStates.findOne({
      attributes: ["id"],
      where: {
        key: "P",
      },
      raw: true,
    });

    Orders.create({
      name,
      address,
      zipcode,
      locality,
      id_shipping_method,
      id_state: pendingState.id,
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
              discount: product.discount,
              discount_type: product.discount_type,
            };
          })
        ).then(() => {
          return res
            .status(201)
            .json({ id: created.id, message: "Encomenda criada com sucesso" });
        });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { name, address, zipcode, locality, id_shipping_method, products } =
      req.body;

    const order = await Orders.findByPk(req.params.id, {
      attributes: ["id"],
      raw: true,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

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

    Orders.update(
      {
        name,
        address,
        zipcode,
        locality,
        id_shipping_method,
        updated_by: req.user,
        updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        where: { id: req.params.id },
      }
    )
      .then(() => {
        OrdersProducts.destroy({ where: { id_order: req.params.id } }).then(
          () => {
            OrdersProducts.bulkCreate(
              products.map((product) => {
                const currentProduct = allProducts.find(
                  (product2) => product2.id === product.id_product
                );
                return {
                  id_order: req.params.id,
                  id_product: product.id_product,
                  quantity: product.quantity,
                  price: currentProduct.price,
                  discount: product.discount,
                  discount_type: product.discount_type,
                };
              })
            ).then(() => {
              return res
                .status(200)
                .json({ message: "Encomenda atualizada com sucesso" });
            });
          }
        );
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.patchOrderState = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Orders.findByPk(id, {
      attributes: ["id", "id_state"],
      raw: true,
    });

    if (!order) {
      return res.status(404).json({ message: "Encomenda não encontrada" });
    }

    const currentState = await OrdersStates.findByPk(order.id_state, {
      attributes: ["order"],
      raw: true,
    });

    const newState = await OrdersStates.findOne({
      attributes: ["id", "shipped", "received"],
      where: {
        order: currentState.order + 1,
      },
      raw: true,
    });

    let body = {
      id_state: newState.id,
    };

    if (newState.shipped) {
      body.date_shipped = moment().format("YYYY-MM-DD HH:mm:ss");
    }

    if (newState.received) {
      body.date_received = moment().format("YYYY-MM-DD HH:mm:ss");
    }

    Orders.update(body, { where: { id } })
      .then(() => {
        return res.status(200).json({ message: "Order state updated" });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
