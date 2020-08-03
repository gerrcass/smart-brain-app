const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const morgan = require("morgan");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

/* //Postgres BD Schema
//psql postgres://smartbrainapp:test@localhost:5432/smart-brain-db

CREATE TABLE users (
	id serial PRIMARY KEY,
	name varchar(100),
	email text UNIQUE NOT NULL,
	entries BIGINT DEFAULT 0,
	joined TIMESTAMP NOT NULL
);

CREATE TABLE login (
	id serial PRIMARY KEY,
	hash varchar(100) NOT NULL,
	email text UNIQUE NOT NULL
); */

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "smartbrainapp",
    password: "test",
    database: "smart-brain-db",
  },
});

const app = express();

app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  //res.send(db.users);
  res.send("It' is working");
});
app.post("/signin", signin.handleSignin(db, bcrypt));
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});
app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
