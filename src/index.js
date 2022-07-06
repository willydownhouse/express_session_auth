const app = require("./app");
const mongoose = require("mongoose");
const config = require("./config");

const PORT = 3000;

mongoose
  .connect(config.DB_CONNECTION)
  .then(() => console.log("db connected"))
  .catch(() => {
    console.log("there is a problem in db connection");
  });

app.listen(PORT, () => console.log(`App listening port ${PORT}`));
