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

const db = knex({
  client: "pg",
  connection: process.env.POSTGRES_URI,
});

const app = express();

app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  //res.send(db.users);
  res.send("It' is working");
});

/* for demonstration purposes, handleAuthentication() is called without 'req' and 'res',
because it's a high order function (a function that return a function) where the returned
function gets called again (with 'db' and 'bcrypt' inyected) using 'req' and 'res' as
declared in handleAuthentication() function which is the shape expected by app.post()
function. It's automatically called like this:

app.post("/signin", signin.handleAuthentication(db, bcrypt)(req,res));
*/
app.post("/signin", signin.handleAuthentication(db, bcrypt));

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.post("/profile/:id", (req, res) =>
  profile.handleProfileUpdate(req, res, db)
);

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
