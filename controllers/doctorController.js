const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const DoctorSchema = require("../models/doctorModel");
const AppointmentsModel = require("../models/appointmentsModel");

exports.doctorController = async (req, res, next) => {
  const {
    name,
    email,
    password,
    experience,
    fees,
    speciality,
    education,
    address,
    about,
  } = req.body;

  // Validate that all required fields are provided
  if (
    !name ||
    !email ||
    !password ||
    !experience ||
    !fees ||
    !speciality ||
    !education ||
    !address ||
    !about
  ) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await DoctorSchema.create({
      name,
      email,
      experience,
      fees,
      speciality,
      education,
      address,
      about,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Doctor created successfully",
      user: newUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    res.status(400).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
};

exports.getDoctor = async (req, res, next) => {
  try {
    // Get pagination parameters from the query string
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    // Fetch paginated results
    const doctors = await DoctorSchema.find()
      .skip(skip) // Skip the first (page-1)*limit documents
      .limit(limit) // Limit the number of documents returned
      .exec();

    // Get the total count of documents for pagination info
    const totalDoctors = await DoctorSchema.countDocuments();
    // Calculate total pages
    const totalPages = Math.ceil(totalDoctors / limit);
    // Respond with paginated data
    res.status(200).json({
      success: true,
      data: doctors,
      pagination: {
        totalDoctors,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor data",
      error: error.message,
    });
  }
};

exports.getAppointments = async (req, res, next) => {
  try {
    // Get pagination parameters from the query string
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    // Fetch paginated results
    const doctors = await AppointmentsModel.find()
      .skip(skip) // Skip the first (page-1)*limit documents
      .limit(limit) // Limit the number of documents returned
      .exec();

    // Get the total count of documents for pagination info
    const totalDoctors = await AppointmentsModel.countDocuments();
    // Calculate total pages
    const totalPages = Math.ceil(totalDoctors / limit);
    // Respond with paginated data
    res.status(200).json({
      success: true,
      data: doctors,
      pagination: {
        totalDoctors,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor data",
      error: error.message,
    });
  }
};

exports.appointmentsCreate = async (req, res, next) => {
  const { patient, speciality, age, date, doctorName, fees } = req.body;

  if (!patient || !speciality || !age || !date || !doctorName || !fees) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  try {

    const newUser = await AppointmentsModel.create({
      patient,
      speciality,
      age,
      date,
      doctorName,
      fees,
    });

    res.status(201).json({
      message: "Patient appointments successfully",
      user: newUser,
    });
  } catch (error) {
    

    res.status(400).json({
      message: "Failed to appointments patient",
      error: error.message,
    });
  }
};
