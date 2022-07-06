const user = require("../models/user");

module.exports = (err, req, res, next) => {
  console.log("error controller:");
  console.log(err);

  if (err.name === "AuthenticationError") {
    return res.status(401).json({
      message: "wrong username or password",
    });
  }

  return res.status(400).json({
    message: err.message,
  });
};
