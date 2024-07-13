const router = require("express").Router();
const { query, body, param } = require("express-validator");
const controller = require("../controllers/shipping_methods");
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
    expressValidatorMiddleware,
    controller.getAllShippingMethods
  )
  .post(
    validateToken,
    body("name").isString(),
    body("price").isFloat({ min: 0 }),
    expressValidatorMiddleware,
    controller.createShippingMethod
  );

router
  .route("/:id")
  .put(
    validateToken,
    param("id").isInt({ min: 1 }),
    body("name").isString(),
    body("price").isFloat({ min: 0 }),
    expressValidatorMiddleware,
    controller.updateShippingMethod
  )
  .delete(
    validateToken,
    param("id").isInt({ min: 1 }),
    expressValidatorMiddleware,
    controller.deleteShippingMethod
  );

module.exports = router;
