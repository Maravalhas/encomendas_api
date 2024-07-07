const router = require("express").Router();
const { body, query, param } = require("express-validator");
const controller = require("../controllers/orders");
const {
  expressValidatorMiddleware,
  validateToken,
} = require("../utilities/middlewares");

router
  .route("/")
  .get(
    validateToken,
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
    query("products").optional().isInt(),
    query("data").optional().isDate(),
    expressValidatorMiddleware,
    controller.getAllOrders
  )
  .post(
    validateToken,
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
    validateToken,
    param("id").isInt({ min: 1 }),
    expressValidatorMiddleware,
    controller.getOrderById
  )
  .patch(
    validateToken,
    param("id").isInt({ min: 1 }),
    expressValidatorMiddleware,
    controller.patchOrderState
  )
  .put(
    validateToken,
    param("id").isInt({ min: 1 }),
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
    controller.updateOrder
  );

module.exports = router;
