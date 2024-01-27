const mongoose = require("mongoose");
const bodySchema = new mongoose.Schema({
  fname: String,
  email: String,
  phone: Number,
  gender: String,
  locality: String,
  password: String,
  cpassword: String,
});

const Register = new mongoose.model("Register", bodySchema);

module.exports = Register;
