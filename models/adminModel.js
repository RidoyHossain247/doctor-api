const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [20, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
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

const adminModel = mongoose.model("Admin", adminSchema);
module.exports = adminModel;
