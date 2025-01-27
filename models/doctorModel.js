const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
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
    experience: {
      type: String,
      trim: true,
      required: true,
    },
    fees: {
      type: String,
      trim: true,
      required: true,
    },
    speciality: {
      type: String,
      trim: true,
      required: true,
    },
    education: {
      type: String,
      trim: true,
      required: true,
    },  
    
    address: {
      type: String,
      trim: true,
      required: true,
    },    
    about: {
      type: String,
      trim: true,
      required: true,
    }, 
    
    isAvailable: {
      type: Boolean,
      default: false, 
    },
    picture: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png', 
    },
  },
  {
    timestamps: true,
  }
);

const doctorModel = mongoose.model("Doctor", doctorSchema);
module.exports = doctorModel;
