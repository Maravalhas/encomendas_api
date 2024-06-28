const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

exports.create = (userId) => {
  try {
    const token = jwt.sign({ id: userId }, secret, { expiresIn: "72h" });
    return token;
  } catch (err) {
    return { err };
  }
};

exports.decode = (token) => {
  try {
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (err) {
    return { err };
  }
};
