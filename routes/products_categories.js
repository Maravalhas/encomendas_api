const router = require("express").Router();
const controller = require("../controllers/products_categories");
const {
  validateToken,
  expressValidatorMiddleware,
} = require("../utilities/middlewares");
const { query, body, param } = require("express-validator");

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
    controller.getAllProductsCategories
  )
  .post(
    validateToken,
    body("name").isString(),
    body("description").optional({ values: "null" }).isString(),
    expressValidatorMiddleware,
    controller.createProductsCategories
  );

router
  .route("/:id")
  .put(
    validateToken,
    param("id").isInt({ min: 1 }),
    body("name").isString(),
    body("description").optional({ values: "null" }).isString(),
    expressValidatorMiddleware,
    controller.updateProductsCategories
  )
  .delete(
    validateToken,
    param("id").isInt({ min: 1 }),
    expressValidatorMiddleware,
    controller.deleteProductsCategories
  );

module.exports = router;
