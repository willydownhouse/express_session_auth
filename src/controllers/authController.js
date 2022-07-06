const User = require("../models/user");

const authorizeWithPassport = async (username, password, done) => {
  const user = await User.findOne({ username });

  if (!user || user.password !== password) {
    return done(null, false);
  }

  return done(null, user);
};

const checkIfAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.redirect("/login");
};

const checkIfAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }

  throw new Error("you are not allowed to do this action");
};

module.exports = {
  authorizeWithPassport,
  checkIfAuthenticated,
  checkIfAdmin,
};
