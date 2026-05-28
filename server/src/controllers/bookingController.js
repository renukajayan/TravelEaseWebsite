const asyncHandler = require("express-async-handler");

const Booking = require("../models/Booking");
const Package = require("../models/Package");

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
const getAllBookings = asyncHandler(async (req, res) => {
  const query = {};

  // Normal users can only see their own bookings
  if (req.user.role !== "admin") {
    query.userId = req.user.id;
  }

  const bookings = await Booking.find(query)
    .populate("userId", "name email role")
    .populate({
      path: "packageId",
      populate: {
        path: "destinationId",
        model: "Destination"
      }
    })
    .sort({ createdAt: -1 });

  res.status(200).json(bookings);
});

// @desc    Get a booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("userId", "name email role")
    .populate({
      path: "packageId",
      populate: {
        path: "destinationId",
        model: "Destination"
      }
    });

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Normal users can only view their own booking
  if (req.user.role !== "admin" && booking.userId._id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("You do not have permission to view this booking");
  }

  res.status(200).json(booking);
});

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const {
    packageId,
    travellerName,
    travellerEmail,
    travellerPhone,
    numberOfTravellers,
    travelDate,
    bookingForSelf
  } = req.body;

  if (
    !packageId ||
    !travellerName ||
    !travellerEmail ||
    !travellerPhone ||
    !numberOfTravellers ||
    !travelDate
  ) {
    res.status(400);
    throw new Error("All booking fields are required");
  }

  const travelPackage = await Package.findById(packageId);

  if (!travelPackage) {
    res.status(404);
    throw new Error("Package not found");
  }

  const travellerCount = Number(numberOfTravellers);

  if (Number.isNaN(travellerCount) || travellerCount < 1) {
    res.status(400);
    throw new Error("Number of travellers must be at least 1");
  }

  if (travelPackage.availableSlots < travellerCount) {
    res.status(400);
    throw new Error("Not enough available slots");
  }

  const booking = await Booking.create({
    userId: req.user.id,
    packageId,
    travellerName,
    travellerEmail,
    travellerPhone,
    numberOfTravellers: travellerCount,
    travelDate,
    bookingForSelf,
    status: "pending",
    rejectionReason: ""
  });

  travelPackage.availableSlots -= travellerCount;
  await travelPackage.save();

  res.status(201).json({
    message: "Booking created successfully",
    booking
  });
});

// @desc    Update a booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = asyncHandler(async (req, res) => {
  const {
    travellerName,
    travellerEmail,
    travellerPhone,
    numberOfTravellers,
    travelDate,
    bookingForSelf,
    status,
    rejectionReason
  } = req.body;

  const booking = await Booking.findById(req.params.id).populate("packageId");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Normal users can only update their own booking
  if (req.user.role !== "admin" && booking.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error("You do not have permission to update this booking");
  }

  const packageDoc = await Package.findById(booking.packageId._id);

  if (!packageDoc) {
    res.status(404);
    throw new Error("Associated package not found");
  }

  const previousTravellers = booking.numberOfTravellers;
  const newTravellerCount =
    numberOfTravellers !== undefined ? Number(numberOfTravellers) : previousTravellers;

  if (Number.isNaN(newTravellerCount) || newTravellerCount < 1) {
    res.status(400);
    throw new Error("Number of travellers must be at least 1");
  }

  const currentStatus = booking.status;
  const newStatus = status || currentStatus;

  // Admin reject flow
  if (newStatus === "rejected") {
    if (req.user.role !== "admin") {
      res.status(403);
      throw new Error("Only admin can reject bookings");
    }

    if (!rejectionReason || rejectionReason.trim() === "") {
      res.status(400);
      throw new Error("Rejection reason is required");
    }

    // restore slots only once if booking was active
    if (currentStatus !== "cancelled" && currentStatus !== "rejected") {
      packageDoc.availableSlots += previousTravellers;
      await packageDoc.save();
    }

    booking.travellerName = travellerName ?? booking.travellerName;
    booking.travellerEmail = travellerEmail ?? booking.travellerEmail;
    booking.travellerPhone = travellerPhone ?? booking.travellerPhone;
    booking.numberOfTravellers = newTravellerCount;
    booking.travelDate = travelDate ?? booking.travelDate;
    booking.bookingForSelf =
      bookingForSelf !== undefined ? bookingForSelf : booking.bookingForSelf;
    booking.status = "rejected";
    booking.rejectionReason = rejectionReason.trim();

    const updatedBooking = await booking.save();

    return res.status(200).json({
      message: "Booking rejected successfully",
      booking: updatedBooking
    });
  }

  // Cancel flow
  if (newStatus === "cancelled" && currentStatus !== "cancelled") {
    if (currentStatus !== "rejected") {
      packageDoc.availableSlots += previousTravellers;
      await packageDoc.save();
    }

    booking.travellerName = travellerName ?? booking.travellerName;
    booking.travellerEmail = travellerEmail ?? booking.travellerEmail;
    booking.travellerPhone = travellerPhone ?? booking.travellerPhone;
    booking.numberOfTravellers = newTravellerCount;
    booking.travelDate = travelDate ?? booking.travelDate;
    booking.bookingForSelf =
      bookingForSelf !== undefined ? bookingForSelf : booking.bookingForSelf;
    booking.status = "cancelled";
    booking.rejectionReason = "";

    const updatedBooking = await booking.save();

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking: updatedBooking
    });
  }

  // Prevent reactivating cancelled/rejected bookings
  if (
    (currentStatus === "cancelled" || currentStatus === "rejected") &&
    (newStatus === "pending" || newStatus === "confirmed")
  ) {
    res.status(400);
    throw new Error("Cancelled or rejected bookings cannot be reactivated");
  }

  // Normal active booking update
  if (newStatus !== "cancelled" && newStatus !== "rejected") {
    const travellerDifference = newTravellerCount - previousTravellers;

    if (travellerDifference > 0 && packageDoc.availableSlots < travellerDifference) {
      res.status(400);
      throw new Error("Not enough available slots for update");
    }

    packageDoc.availableSlots -= travellerDifference;
    await packageDoc.save();
  }

  booking.travellerName = travellerName ?? booking.travellerName;
  booking.travellerEmail = travellerEmail ?? booking.travellerEmail;
  booking.travellerPhone = travellerPhone ?? booking.travellerPhone;
  booking.numberOfTravellers = newTravellerCount;
  booking.travelDate = travelDate ?? booking.travelDate;
  booking.bookingForSelf =
    bookingForSelf !== undefined ? bookingForSelf : booking.bookingForSelf;
  booking.status = newStatus;
  booking.rejectionReason = "";

  const updatedBooking = await booking.save();

  res.status(200).json({
    message: "Booking updated successfully",
    booking: updatedBooking
  });
});

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Normal users can only delete their own booking
  if (req.user.role !== "admin" && booking.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error("You do not have permission to delete this booking");
  }

  // Restore slots only if booking was not already cancelled/rejected
  if (booking.status !== "cancelled" && booking.status !== "rejected") {
    const travelPackage = await Package.findById(booking.packageId);

    if (travelPackage) {
      travelPackage.availableSlots += booking.numberOfTravellers;
      await travelPackage.save();
    }
  }

  await booking.deleteOne();

  res.status(200).json({
    message: "Booking deleted successfully"
  });
});

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
};