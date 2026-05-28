const express = require("express");

const router = express.Router();

const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
} = require("../controllers/bookingController");

const authenticateToken = require("../middleware/authenticateToken");
const validateObjectId = require("../middleware/validateObjectId");
const {
  bookingValidation,
  bookingUpdateValidation,
} = require("../middleware/validation");

// All booking routes require authentication
router.use(authenticateToken);

// @route   GET /api/bookings
// @desc    Get all bookings (admin: all, user: own)
// @access  Private
// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router
  .route("/")
  .get(getAllBookings)
  .post(bookingValidation, createBooking);

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
// @route   PUT /api/bookings/:id
// @desc    Update booking
// @access  Private
// @route   DELETE /api/bookings/:id
// @desc    Delete booking
// @access  Private
router
  .route("/:id")
  .all(validateObjectId("id"))
  .get(getBookingById)
  .put(bookingUpdateValidation, updateBooking)
  .delete(deleteBooking);

module.exports = router;