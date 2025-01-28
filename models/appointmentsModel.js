const mongoose = require("mongoose");

const appointmentsSchema = new mongoose.Schema(
  {
    patient: {
      type: String,
      trim: true,
      required: true,
    },
    speciality: {
      type: String,
      trim: true,
      required: true,
    },
    age: {
      type: Number,
      trim: true,
      required: true,
    },
    date: {
      type: String,
      trim: true,
      required: true,
    },
    doctorName: {
      type: String,
      trim: true,
      required: true,
    },
    fees: {
      type: Number,
      trim: true,
      required: true,
    },
    isComplete: {
      type: Boolean,
      default: false,
    }, 
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const appointmentsModel = mongoose.model("Appointment", appointmentsSchema);
module.exports = appointmentsModel;
