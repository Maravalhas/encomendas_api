const Users = require("../models/users");

const bcrypt = require("bcrypt");
const { create } = require("../utilities/tokens");

exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Users.findOne({
      attributes: ["id", "password"],
      where: {
        username,
      },
      raw: true,
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = create(user.id);

    return res.status(200).json({
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
