const asyncHandler = require("express-async-handler");

const Destination = require("../models/Destination");
const Package = require("../models/Package");

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
const getAllDestinations = asyncHandler(async (req, res) => {
  const destinations = await Destination.find().sort({ createdAt: -1 });

  res.status(200).json(destinations);
});

// @desc    Get destination by ID
// @route   GET /api/destinations/:id
// @access  Public
const getDestinationById = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    res.status(404);
    throw new Error("Destination not found");
  }

  res.status(200).json(destination);
});

// @desc    Create destination
// @route   POST /api/destinations
// @access  Private/Admin
const createDestination = asyncHandler(async (req, res) => {
  const { name, country, description, imageUrl, currency, bestSeason } = req.body;

  if (!name || !country || !description || !imageUrl || !currency || !bestSeason) {
    res.status(400);
    throw new Error(
      "All fields (name, country, description, imageUrl, currency, bestSeason) are required"
    );
  }

  const existingDestination = await Destination.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
    country: { $regex: `^${country}$`, $options: "i" }
  });

  if (existingDestination) {
    res.status(400);
    throw new Error("Destination already exists");
  }

  const destination = await Destination.create({
    name,
    country,
    description,
    imageUrl,
    currency,
    bestSeason
  });

  res.status(201).json({
    message: "Destination created successfully",
    destination
  });
});

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
const updateDestination = asyncHandler(async (req, res) => {
  const { name, country, description, imageUrl, currency, bestSeason } = req.body;

  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    res.status(404);
    throw new Error("Destination not found");
  }

  destination.name = name ?? destination.name;
  destination.country = country ?? destination.country;
  destination.description = description ?? destination.description;
  destination.imageUrl = imageUrl ?? destination.imageUrl;
  destination.currency = currency ?? destination.currency;
  destination.bestSeason = bestSeason ?? destination.bestSeason;

  const updatedDestination = await destination.save();

  res.status(200).json({
    message: "Destination updated successfully",
    destination: updatedDestination
  });
});

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
const deleteDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    res.status(404);
    throw new Error("Destination not found");
  }

  const relatedPackages = await Package.find({ destinationId: req.params.id });

  if (relatedPackages.length > 0) {
    res.status(400);
    throw new Error("Cannot delete destination because it has related packages");
  }

  await destination.deleteOne();

  res.status(200).json({
    message: "Destination deleted successfully"
  });
});

module.exports = {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
};