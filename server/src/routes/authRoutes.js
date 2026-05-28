const express = require("express");

const router = express.Router();

const { register, login } = require("../controllers/authController");
const {
  registerValidation,
  loginValidation
} = require("../middleware/validation");

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", registerValidation, register);

// @route   POST /api/auth/login
// @desc    Login user and return JWT token
// @access  Public
router.post("/login", loginValidation, login);

module.exports = router;