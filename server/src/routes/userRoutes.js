const express = require("express");

const router = express.Router();

const {
  getProfile,
  getAllUsers,
  deleteUser
} = require("../controllers/userController");

const authenticateToken = require("../middleware/authenticateToken");
const authorizeRole = require("../middleware/authorizeRole");

// @route   GET /api/users/me
// @desc    Get logged-in user profile
// @access  Private
router.get("/me", authenticateToken, getProfile);

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get("/", authenticateToken, authorizeRole("admin"), getAllUsers);

// @route   DELETE /api/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  deleteUser
);

module.exports = router;