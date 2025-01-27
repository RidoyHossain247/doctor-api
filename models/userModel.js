const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [20, "Name cannot exceed 50 characters"],
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      match: [/^\d{11}$/, "Phone number must be 11 digits"], 
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
