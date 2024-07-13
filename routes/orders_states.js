const router = require("express").Router();
const controller = require("../controllers/orders_states");
const { validateToken } = require("../utilities/middlewares");

router.route("/").get(validateToken, controller.getAllOrdersStates);

module.exports = router;
