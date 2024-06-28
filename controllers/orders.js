const Orders = require("../models/orders");
const OrdersProducts = require("../models/orders_products");
const Products = require("../models/products");
const ShippingMethods = require("../models/shipping_methods");

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
    const order = await Orders.findByPk(req.params.id, {
      attributes: [
        "id",
        "name",
        "address",
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
            [Sequelize.literal("`OrdersProducts->Product`.name"), "product"],
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
    const { name, address, id_shipping_method, products } = req.body;

    const shippingMethod = await ShippingMethods.findByPk(id_shipping_method, {
      attributes: ["id"],
      where: { active: 1 },
      raw: true,
    });

    if (!shippingMethod) {
      return res.status(400).json({ message: "Invalid shipping method" });
    }

    const allProducts = await Products.findAll({
      where: { id: products.map((product) => product.productId) },
    });

    if (allProducts.length !== products.length) {
      return res.status(403).json({ message: "Invalid products" });
    }

    Orders.create({
      name,
      address,
      id_shipping_method,
      created_by: req.user,
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    })
      .then((created) => {
        OrdersProducts.bulkCreate(
          products.map((product) => {
            const currentProduct = allProducts.find(
              (product) => product.id === product.product
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
