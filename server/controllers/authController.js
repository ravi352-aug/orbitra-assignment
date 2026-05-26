const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};



// ================= REGISTER USER =================

const registerUser = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {

      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });

    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Trim name
    const trimmedName = String(name).trim();
    if (trimmedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });

    }

    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name: trimmedName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Send response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user._id),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};




// ================= LOGIN USER =================

const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check user exists
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {

      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });

    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });

    }

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};




// ================= GET CURRENT USER =================

const getMe = async (req, res) => {

  try {

    res.status(200).json({
      success: true,
      user: req.user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};




// ================= EXPORTS =================

module.exports = {
  registerUser,
  loginUser,
  getMe,
};