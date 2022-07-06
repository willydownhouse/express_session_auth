const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const config = require("./config");
const {
  authorizeWithPassport,
  checkIfAuthenticated,
  checkIfAdmin,
} = require("./controllers/authController");
const errorHandler = require("./controllers/errorController");

const app = express();

app.set("view engine", "ejs");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const sessionStore = MongoStore.create({
  mongoUrl: config.SESSION_DB_STRING,
  collectionName: "sessions",
});

app.use(
  session({
    name: "sessionId",
    secret: config.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: sessionStore,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(authorizeWithPassport));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use((req, res, next) => {
  console.log("REQ SESSION:");
  console.log(req.session);
  // console.log("session passport");
  // console.log(req.session.passport);
  console.log("authenticated:", req.isAuthenticated());

  next();
});

//VIEWS

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login", { message: req.session.messages });
});
app.get("/home", checkIfAuthenticated, (req, res) => {
  res.render("home");
});

//LOGIN

/* app.post(
  "/api/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",

    //failureMessage: "wrong username or password", tää menee req.session objektiin
  })
  
); */
app.post(
  "/api/login",
  passport.authenticate("local", {
    failWithError: true,
  }),
  (req, res, next) => {
    if (req.user) {
      res.status(200).json({
        message: "You logged in",
        user: req.user.username,
      });
    }
  },
  (err, req, res, next) => {
    if (!req.user) {
      return next(err);
    }
  }
);

app.get("/admin", checkIfAdmin, (req, res) => {
  res.send("this route only for admin");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.all("*", (req, res) => res.status(404).send("unknown endpoint"));

app.use(errorHandler);

module.exports = app;
