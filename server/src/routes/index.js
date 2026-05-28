const express = require("express");

const router = express.Router();

// Route imports
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const destinationRoutes = require("./destinationRoutes");
const packageRoutes = require("./packageRoutes");
const bookingRoutes = require("./bookingRoutes");

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/destinations", destinationRoutes);
router.use("/packages", packageRoutes);
router.use("/bookings", bookingRoutes);

module.exports = router;