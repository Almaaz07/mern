const mongoose = require("mongoose")

 const bodySchema = new mongoose.Schema({
   fname: String,
   email: String,
   phone: Number,
   gender: String,
   locality: String,
   password: String,
   cpassword: String,
 })

 const Login = new mongoose.model("Login" , bodySchema);

 module.exports = Login ;