const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRegisterSchema = require('../models/userModel');

exports.userRegister = async (req, res, next) => {
  const { name, phoneNumber, password } = req.body;

  // Validate that all required fields are provided
  if (!name || !phoneNumber || !password) {
    return res.status(400).json({
      message: "All fields (name, phoneNumber, password) are required.",
    });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await UserRegisterSchema.create({
      name,
      phoneNumber,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      user: { name: newUser.name, phoneNumber: newUser.phoneNumber,password:password },
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle unique field errors (e.g., duplicate phoneNumber)
      return res.status(400).json({
        message: "Phone number already exists",
      });
    }

    res.status(400).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
};


exports.userLogin = async(req,res,next)=>{
  const {name,phoneNumber,password} = req.body
  try {
    const user = await UserRegisterSchema.findOne({ phoneNumber });

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
      { phoneNumber, id: user._id },
      process.env.PRIVATE_KEY,
      { expiresIn: "2h" }
    );
    const userInfo ={
      name:user.name,
      phoneNumber:user.phoneNumber,
    }
    res.status(200).json({
      message: "Login successful",
      token: token,
      user :userInfo
    });
  } catch (error) {
    res.status(401).json({
      message:'Failed to login',
      error:error.message
    })
  }
}

exports.userChangePassword = async(req,res,next)=>{
  const { phoneNumber, oldPassword, password } = req.body;

  // Validate inputs
  if (!phoneNumber || !oldPassword || !password) {
    return res.status(400).json({
      message: "All fields (oldPassword, password) are required.",
    });
  }

  try {
    // Find user by phoneNumber
    const user = await UserRegisterSchema.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    // Verify old password
    const isValid = await bcrypt.compare(oldPassword, user.password);

    if (!isValid) {
      return res.status(400).json({
        message: "Old password is incorrect!",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while changing the password.",
      error: error.message,
    });
  }
}

