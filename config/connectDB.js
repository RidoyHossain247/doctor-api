const mongoose = require("mongoose");

connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://mdridoyhossain247:5FLY8uWCaUGjSDhF@cluster0.ldl29.mongodb.net/');
    console.log("Data base connect successfully");
  } catch (error) {
    console.log("Database connection fill!");
  }
};

module.exports = connectDB;
