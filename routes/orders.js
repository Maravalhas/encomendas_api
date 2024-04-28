const router = require("express").Router();
const { query, param } = require("express-validator");
const controller = require("../controllers/orders");
const { expressValidatorMiddleware } = require("../utilities/middlewares");

router.route("/").get(
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
);

router
  .route("/:id")
  .get(
    param("id").isInt({ min: 1 }),
    expressValidatorMiddleware,
    controller.getOrderById
  );

module.exports = router;
