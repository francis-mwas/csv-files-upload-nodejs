const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  seq: {
    type: Number,
    ref: "Vendor"
  },
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  username: {
    type: String
  },
  email: {
    type: String
  },
  age: {
    type: String
  },
  street: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zip: {
    type: String
  },
  dollar: {
    type: String
  },
  pick: {
    type: String
  },
  date: {
    type: Date
  }
});

module.exports = Users = mongoose.model("User", userSchema);
