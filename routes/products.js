const router = require("express").Router();
const controller = require("../controllers/products");
const { query, param, body } = require("express-validator");
const {
  expressValidatorMiddleware,
  validateToken,
} = require("../utilities/middlewares");

router
  .route("/")
  .get(
    validateToken,
    query("limit").optional({ values: "null" }).isInt({ min: 0 }).toInt(),
    query("offset").optional({ values: "null" }).isInt({ min: 0 }).toInt(),
    query("order").optional({ values: "null" }).isArray().isLength(2),
    query("active").optional({ values: "null" }).isArray(),
    query("active.*")
      .if(query("active").exists())
      .isInt({ min: 0, max: 1 })
      .toInt(),
    query("search")
      .optional({ values: "null" })
      .isString()
      .customSanitizer((value) => `%${value.replaceAll(" ", "%")}%`),
    expressValidatorMiddleware,
    controller.getAllProducts
  )
  .post(
    validateToken,
    body("name").isString(),
    body("description").optional({ values: "null" }).isString(),
    body("price").isFloat({ min: 0 }),
    body("stock").isInt({ min: 0 }),
    body("id_category").isInt({ min: 1 }),
    expressValidatorMiddleware,
    controller.createProduct
  );

router
  .route("/:id")
  .put(
    validateToken,
    param("id").isInt({ min: 1 }),
    body("name").isString(),
    body("description").optional({ values: "null" }).isString(),
    body("price").isFloat({ min: 0 }),
    body("stock").isInt({ min: 0 }),
    body("id_category").isInt({ min: 1 }),
    expressValidatorMiddleware,
    controller.updateProduct
  );

module.exports = router;
