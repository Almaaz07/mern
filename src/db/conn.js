const mongooose = require("mongoose");
// const bcrypt = require("bcryptjs");
mongooose.connect("mongodb://127.0.0.1:27017/gym" , {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreatIndex:true
  })
  .then(() => console.log("connection successfull"))
  .catch((err) => console.log(err));
