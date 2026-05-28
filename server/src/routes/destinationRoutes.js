const express = require("express");

const router = express.Router();

const {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
} = require("../controllers/destinationController");

const { getPackagesByDestination } = require("../controllers/packageController");

const authenticateToken = require("../middleware/authenticateToken");
const authorizeRole = require("../middleware/authorizeRole");
const validateObjectId = require("../middleware/validateObjectId");
const { destinationValidation } = require("../middleware/validation");

// @route   GET /api/destinations
// @desc    Get all destinations
// @access  Public
// @route   POST /api/destinations
// @desc    Create destination
// @access  Private/Admin
router
  .route("/")
  .get(getAllDestinations)
  .post(
    authenticateToken,
    authorizeRole("admin"),
    destinationValidation,
    createDestination
  );

// @route   GET /api/destinations/:id
// @desc    Get destination by ID
// @access  Public
// @route   PUT /api/destinations/:id
// @desc    Update destination
// @access  Private/Admin
// @route   DELETE /api/destinations/:id
// @desc    Delete destination
// @access  Private/Admin
router
  .route("/:id")
  .all(validateObjectId("id"))
  .get(getDestinationById)
  .put(
    authenticateToken,
    authorizeRole("admin"),
    destinationValidation,
    updateDestination
  )
  .delete(
    authenticateToken,
    authorizeRole("admin"),
    deleteDestination
  );

// @route   GET /api/destinations/:id/packages
// @desc    Get all packages for a destination
// @access  Public
router.get("/:id/packages", validateObjectId("id"), getPackagesByDestination);

module.exports = router;