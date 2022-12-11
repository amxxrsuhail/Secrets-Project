require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
// var md5 = require('md5');
const mongoose = require("mongoose");
// var encrypt = require("mongoose-encryption");
const bcrypt = require("bcrypt");
const saltRounds = 10;
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      email: req.body.username,
      // password: md5(req.body.password),
      password: hash,
    });
    newUser.save((err) => {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // const password = md5(req.body.password);
  User.findOne({ email: username }, (err, foundUser) => {
    if (!err) {
      if (foundUser) {
        bcrypt.compare(
          req.body.password,
          foundUser.password,
          function (err, result) {
            if (result == true) {
              res.render("secrets");
            } else {
              console.log("User doesnt exist!!!!!!!!!!!");
            }
          }
        );
      } else {
        console.log("User doesnt exist!!!!!!!!!!!");
      }
    }
  });
});

app.listen(3000, () => {
  console.log("server started at 3000");
});
