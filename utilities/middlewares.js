const { validationResult } = require("express-validator");
const { decode } = require("./tokens");
const Users = require("../models/users");

exports.expressValidatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.errors);
  }
  next();
};

exports.validateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Token not found!" });

    const data = decode(token);

    const user = await Users.findByPk(data.id, {
      attributes: ["id"],
      raw: true,
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    req.user = data.id;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
