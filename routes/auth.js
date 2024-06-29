const router = require("express").Router();
const controller = require("../controllers/auth");
const { body } = require("express-validator");
const {
  expressValidatorMiddleware,
  validateToken,
} = require("../utilities/middlewares");

router
  .route("/")
  .post(
    body("username").isString(),
    body("password").isString(),
    expressValidatorMiddleware,
    controller.signin
  );

router.route("/user").get(validateToken, controller.getUserByToken);

module.exports = router;
