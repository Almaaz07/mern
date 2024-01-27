const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("./db/conn");
const hbs = require("hbs");
const Register = require("./models/registers");
const bcrypt = require('bcryptjs');
const Login = require("./models/login");
const Collection = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.port || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const templetspath = path.join(__dirname, "../templets/views");
const partialspath = path.join(__dirname, "../templets/partials");

app.use(express.static(templetspath));
app.set("view engine", "hbs");
app.use(cookieParser());

app.set("views", templetspath);
hbs.registerPartials(partialspath);

app.get("/", (req, res) => {
  res.render("index");
});


app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", async (req, res) => {
  
  const salt = await bcrypt.genSalt(10);
  const secpassword = await bcrypt.hash(req.body.password , salt)
  const resecpassword = await bcrypt.hash(req.body.cpassword , salt)
  try {
    const registeremployee = Login({
      fname: req.body.fname,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      locality: req.body.locality,
      password: secpassword,
      cpassword: resecpassword,
    // const registeremployee = Register({
    //   fname: req.body.fname,
    //   email: req.body.email,
    //   phone: req.body.phone,
    //   gender: req.body.gender,
    //   locality: req.body.locality,
    //   password: secpassword,
    //   cpassword: resecpassword,
    });

    const registered = await registeremployee.save();
    res.status(201).render("register");
  } catch (error) {
    res.status(400).send(error);
  }
});
const isauth = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const decoded = jwt.verify(token, "lorem23");
    req.newuser = await Login.findById(decoded._id);
    // console.log(req.newuser)

    next();
  } else {
    res.render("login");
  }
};

app.get("/login", isauth, (req, res) => {
  console.log(req.newuser);
  res.render("logout", { name: req.newuser.fname, pass: req.newuser.password });
});

// for login (only for existing or registered users)

app.post("/login", async (req, res) => {
  let user1 = await Login.findOne({
    email: req.body.email,
  });

  // if (!user1) {
  const { fname, password, phone, email } = req.body;

  // let loginn = "";
   let loginn= await Login.findOne({email:email});
  if (!loginn) {
    return res.redirect("/register");
  }
  //  loginn = await Login.create({ fname, password, phone, email });
  res.render("logout");

  // authentication with JWT
  const token = jwt.sign({ _id: loginn._id }, "lorem23");
  console.log(token);
  res.cookie("token", token),
    {
      httponly: true,
      expires: new Date(Date.now() + 60 * 1000),
    };
  res.redirect("/login")


});

//Route for the logout page
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

// passive server listen

app.listen(port, () => {
  console.log(`server is running on port http://localhost:${port}`);
});
