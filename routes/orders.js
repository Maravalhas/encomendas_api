const router = require("express").Router();
const { body, query, param } = require("express-validator");
const controller = require("../controllers/orders");
const { expressValidatorMiddleware } = require("../utilities/middlewares");

router
  .route("/")
  .get(
    query("limit")
      .optional()
      .isInt({ min: 0 })
      .customSanitizer((value) => parseInt(value)),
    query("offset")
      .optional()
      .isInt({ min: 0 })
      .customSanitizer((value) => parseInt(value)),
    query("order").optional().isArray().isLength(2),
    query("state")
      .optional()
      .isInt({ min: 1 })
      .customSanitizer((value) => parseInt(value)),
    query("search")
      .optional()
      .isString()
      .customSanitizer((value) => `%${value.replaceAll(" ", "%")}%`),
    expressValidatorMiddleware,
    controller.getAllOrders
  )
  .post(
    body("name").isString().notEmpty(),
    body("address").isString().notEmpty(),
    body("zipcode").isString().notEmpty(),
    body("locality").isString().notEmpty(),
    body("id_shipping_method").isInt({ min: 1 }),
    body("products").isArray().notEmpty(),
    body("products.*.id_product")
      .if(body("products").exists())
      .isInt({ min: 1 }),
    body("products.*.quantity").if(body("products").exists()).isInt({ min: 1 }),
    expressValidatorMiddleware,
    controller.createOrder
  );

router
  .route("/:id")
  .get(
    param("id").isInt({ min: 1 }),
    expressValidatorMiddleware,
    controller.getOrderById
  )
  .patch(
    param("id").isInt({ min: 1 }),
    expressValidatorMiddleware,
    controller.patchOrderState
  );

module.exports = router;
