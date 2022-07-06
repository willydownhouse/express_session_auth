require("dotenv").config();

const SESSION_SECRET = process.env.SESSION_SECRET;
const SESSION_DB_STRING = process.env.SESSION_DB_STRING;
const DB_CONNECTION = process.env.DB_CONNECTION;

module.exports = {
  SESSION_SECRET,
  SESSION_DB_STRING,
  DB_CONNECTION,
};
