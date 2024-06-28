const router = require("express").Router();
const controller = require("../controllers/auth");
const { query } = require("express-validator");
const { expressValidatorMiddleware } = require("../utilities/middlewares");

router
  .route("/")
  .post(
    query("email").isEmail(),
    query("password").isString(),
    expressValidatorMiddleware,
    controller.signin
  );

module.exports = router;
