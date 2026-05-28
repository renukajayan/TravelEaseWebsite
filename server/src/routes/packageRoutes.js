const express = require("express");

const router = express.Router();

const {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
} = require("../controllers/packageController");

const authenticateToken = require("../middleware/authenticateToken");
const authorizeRole = require("../middleware/authorizeRole");
const validateObjectId = require("../middleware/validateObjectId");
const { packageValidation } = require("../middleware/validation");

// @route   GET /api/packages
// @desc    Get all packages (with filters)
// @access  Public
// @route   POST /api/packages
// @desc    Create a package
// @access  Private/Admin
router
  .route("/")
  .get(getAllPackages)
  .post(
    authenticateToken,
    authorizeRole("admin"),
    packageValidation,
    createPackage
  );

// @route   GET /api/packages/:id
// @desc    Get package by ID
// @access  Public
// @route   PUT /api/packages/:id
// @desc    Update package
// @access  Private/Admin
// @route   DELETE /api/packages/:id
// @desc    Delete package
// @access  Private/Admin
router
  .route("/:id")
  .all(validateObjectId("id"))
  .get(getPackageById)
  .put(
    authenticateToken,
    authorizeRole("admin"),
    packageValidation,
    updatePackage
  )
  .delete(
    authenticateToken,
    authorizeRole("admin"),
    deletePackage
  );

module.exports = router;