require("dotenv").config();

const cors = require("cors");
const express = require("express");

const connection = require("./utilities/connection");

const app = express();

app.use(cors());
app.use(express.json());

connection
  .authenticate()
  .then(() => {
    console.log(`Connected to database - ${process.env.DB_NAME}`);

    app.use("/auth", require("./routes/auth"));
    app.use("/orders", require("./routes/orders"));
    app.use("/products", require("./routes/products"));
    app.use("/shipping_methods", require("./routes/shipping_methods"));

    if (process.env.SYNC) {
      connection
        .sync({ force: true })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          process.exit();
        });
    } else {
      app.listen(process.env.PORT, () => {
        console.log(`App listening @${process.env.PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error(err);
  });
