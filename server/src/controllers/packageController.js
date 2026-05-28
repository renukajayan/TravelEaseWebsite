const asyncHandler = require("express-async-handler");

const Package = require("../models/Package");
const Destination = require("../models/Destination");
const Booking = require("../models/Booking");

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
const getAllPackages = asyncHandler(async (req, res) => {
  const { destinationId, country, minPrice, maxPrice, durationDays, sort } = req.query;

  const filter = {};

  if (destinationId) {
    filter.destinationId = destinationId;
  }

  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  if (durationDays) {
    filter.durationDays = Number(durationDays);
  }

  if (country && !destinationId) {
    const matchingDestinations = await Destination.find({
      country: { $regex: country, $options: "i" }
    }).select("_id");

    filter.destinationId = { $in: matchingDestinations.map((d) => d._id) };
  }

  let sortOption = { createdAt: -1 };

  if (sort === "price_asc") {
    sortOption = { price: 1 };
  } else if (sort === "price_desc") {
    sortOption = { price: -1 };
  } else if (sort === "days_asc") {
    sortOption = { durationDays: 1 };
  } else if (sort === "days_desc") {
    sortOption = { durationDays: -1 };
  }

  const packages = await Package.find(filter)
    .populate("destinationId")
    .sort(sortOption);

  res.status(200).json(packages);
});

// @desc    Get package by ID
// @route   GET /api/packages/:id
// @access  Public
const getPackageById = asyncHandler(async (req, res) => {
  const travelPackage = await Package.findById(req.params.id).populate("destinationId");

  if (!travelPackage) {
    res.status(404);
    throw new Error("Package not found");
  }

  res.status(200).json(travelPackage);
});

// @desc    Create package
// @route   POST /api/packages
// @access  Private/Admin
const createPackage = asyncHandler(async (req, res) => {
  const {
    title,
    destinationId,
    durationDays,
    price,
    description,
    features,
    placesIncluded,
    imageUrl,
    availableSlots
  } = req.body;

  if (
    !title ||
    !destinationId ||
    !durationDays ||
    !price ||
    !description ||
    !imageUrl ||
    availableSlots === undefined
  ) {
    res.status(400);
    throw new Error(
      "Required fields are title, destinationId, durationDays, price, description, imageUrl and availableSlots"
    );
  }

  const destination = await Destination.findById(destinationId);

  if (!destination) {
    res.status(404);
    throw new Error("Destination not found");
  }

  const existingPackage = await Package.findOne({
    title: { $regex: `^${title}$`, $options: "i" },
    destinationId
  });

  if (existingPackage) {
    res.status(400);
    throw new Error("Package already exists for this destination");
  }

  const travelPackage = await Package.create({
    title,
    destinationId,
    durationDays,
    price,
    description,
    features: features || [],
    placesIncluded: placesIncluded || [],
    imageUrl,
    availableSlots
  });

  res.status(201).json({
    message: "Package created successfully",
    package: travelPackage
  });
});

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private/Admin
const updatePackage = asyncHandler(async (req, res) => {
  const {
    title,
    destinationId,
    durationDays,
    price,
    description,
    features,
    placesIncluded,
    imageUrl,
    availableSlots
  } = req.body;

  const travelPackage = await Package.findById(req.params.id);

  if (!travelPackage) {
    res.status(404);
    throw new Error("Package not found");
  }

  const finalDestinationId = destinationId || travelPackage.destinationId;

  const destination = await Destination.findById(finalDestinationId);

  if (!destination) {
    res.status(404);
    throw new Error("Destination not found");
  }

  travelPackage.title = title ?? travelPackage.title;
  travelPackage.destinationId = finalDestinationId;
  travelPackage.durationDays = durationDays ?? travelPackage.durationDays;
  travelPackage.price = price ?? travelPackage.price;
  travelPackage.description = description ?? travelPackage.description;
  travelPackage.features = features ?? travelPackage.features;
  travelPackage.placesIncluded = placesIncluded ?? travelPackage.placesIncluded;
  travelPackage.imageUrl = imageUrl ?? travelPackage.imageUrl;
  travelPackage.availableSlots = availableSlots ?? travelPackage.availableSlots;

  const updatedPackage = await travelPackage.save();

  res.status(200).json({
    message: "Package updated successfully",
    package: updatedPackage
  });
});

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
const deletePackage = asyncHandler(async (req, res) => {
  const travelPackage = await Package.findById(req.params.id);

  if (!travelPackage) {
    res.status(404);
    throw new Error("Package not found");
  }

  const relatedBookings = await Booking.find({ packageId: req.params.id });

  if (relatedBookings.length > 0) {
    res.status(400);
    throw new Error("Cannot delete package because it has related bookings");
  }

  await travelPackage.deleteOne();

  res.status(200).json({
    message: "Package deleted successfully"
  });
});

// @desc    Get packages by destination
// @route   GET /api/destinations/:id/packages
// @access  Public
const getPackagesByDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    res.status(404);
    throw new Error("Destination not found");
  }

  const packages = await Package.find({ destinationId: req.params.id })
    .populate("destinationId")
    .sort({ createdAt: -1 });

  res.status(200).json(packages);
});

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  getPackagesByDestination
};