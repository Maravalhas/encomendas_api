const router = require("express").Router();
const { query } = require("express-validator");
const controller = require("../controllers/shipping_methods");
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
  controller.getAllShippingMethods
);

module.exports = router;
