require("dotenv").config();

const cors = require("cors");
const express = require("express");

const connection = require("./utilities/connection");

const app = express();
app.use(cors());

connection.authenticate().then(() => {
  console.log(`Connected to database - ${process.env.DB_NAME}`);

  app.use("/orders", require("./routes/orders"));

  connection.sync({ force: true });

  app.listen(process.env.PORT, () => {
    console.log(`App listening @${process.env.PORT}`);
  });
});
