//importation
const mongoose = require("mongoose");

// define the Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  age: Number,
  country: String,
  gender: String,
},
{ timestamps: true }
);

//Create The Model based On The Schema
const User = mongoose.model("customer", userSchema);

// Export The Schema
module.exports = User;
