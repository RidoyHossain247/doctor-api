const DoctorSchema = require("../models/doctorModel");
const AdminSchema = require("../models/adminModel");
const AppointmentsSchema = require("../models/appointmentsModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const blacklistedTokens = new Set();





exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await AdminSchema.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Wrong credentials!",
      });
    }

    const validated = await bcrypt.compare(password, user.password);

    if (!validated) {
      return res.status(400).json({
        message: "Password dosen't match!",
      });
    }
    const token = await jwt.sign(
      { email, id: user._id },
      process.env.PRIVATE_KEY,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
      user,
    });
  } catch (error) {
    res.status(401).json({
      message: "Failed to login",
      error: error.message,
    });
  }
};

exports.adminRegister = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validate that all required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await AdminSchema.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin created successfully",
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

exports.getDashboard = async (req, res, next) => {
  try {
    const doctor = await DoctorSchema.countDocuments();
    const appointments = await AppointmentsSchema.countDocuments();
    const patients = await AppointmentsSchema.countDocuments({
      isComplete: true,
    });   
     const patientsDelete = await AppointmentsSchema.countDocuments({
      isDelete: true,
    });
    const latestAppointments = await AppointmentsSchema.find({
      isDelete: false,
      isComplete: false,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("patient date");
    res.status(200).json({
      doctor,
      appointments,
      patients,
      patientsDelete,
      latestAppointments,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};

exports.adminLogout =async (req,res,nex)=>{
  const token = req.header('Authorization')?.split(' ')[1];
  if (token) {
    blacklistedTokens.add(token); 
  }
  res.status(200).json({ message: 'Logged out successfully' });
}