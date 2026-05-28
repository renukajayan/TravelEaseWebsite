const { body, validationResult } = require("express-validator");

// Common validation result handler
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

// Auth validations
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  validate,
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),

  validate,
];

// Destination validations
const destinationValidation = [
  body("name").trim().notEmpty().withMessage("Destination name is required"),

  body("country").trim().notEmpty().withMessage("Country is required"),

  body("description").trim().notEmpty().withMessage("Description is required"),

  body("imageUrl")
    .trim()
    .notEmpty()
    .withMessage("Image URL is required")
    .bail()
    .isURL()
    .withMessage("Image URL must be a valid URL"),

  body("currency").trim().notEmpty().withMessage("Currency is required"),

  body("bestSeason").trim().notEmpty().withMessage("Best season is required"),

  validate,
];

// Package validations
const packageValidation = [
  body("title").trim().notEmpty().withMessage("Package title is required"),

  body("destinationId")
    .trim()
    .notEmpty()
    .withMessage("Destination ID is required"),

  body("durationDays")
    .isInt({ min: 1 })
    .withMessage("Duration must be at least 1 day"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("description").trim().notEmpty().withMessage("Description is required"),

  body("imageUrl")
    .trim()
    .notEmpty()
    .withMessage("Image URL is required")
    .bail()
    .isURL()
    .withMessage("Image URL must be a valid URL"),

  body("availableSlots")
    .isInt({ min: 0 })
    .withMessage("Available slots must be 0 or more"),

  body("features")
    .optional()
    .isArray()
    .withMessage("Features must be an array"),

  body("placesIncluded")
    .optional()
    .isArray()
    .withMessage("Places included must be an array"),

  validate,
];

// Booking create validation
const bookingValidation = [
  body("packageId").trim().notEmpty().withMessage("Package ID is required"),

  body("travellerName")
    .trim()
    .notEmpty()
    .withMessage("Traveller name is required"),

  body("travellerEmail")
    .trim()
    .isEmail()
    .withMessage("Valid traveller email is required")
    .normalizeEmail(),

  body("travellerPhone")
  .matches(/^[0-9]+$/)
  .withMessage("Phone number must contain numbers only"),

  body("numberOfTravellers")
    .isInt({ min: 1 })
    .withMessage("At least 1 traveller is required"),

  // TRAVEL DATE (future only)
  body("travelDate")
    .isISO8601()
    .withMessage("Valid date required")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Travel date must be in the future");
      }
      return true;
    }),

  body("bookingForSelf")
    .optional()
    .isBoolean()
    .withMessage("bookingForSelf must be true or false"),

  body("status")
    .optional()
    .isIn(["pending", "confirmed", "cancelled", "rejected"])
    .withMessage("Status must be pending, confirmed, cancelled, or rejected"),

  body("rejectionReason")
    .optional()
    .isString()
    .withMessage("Rejection reason must be text"),

  validate,
];

// Booking update validation
const bookingUpdateValidation = [
  body("packageId")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Package ID cannot be empty"),

  body("travellerName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Traveller name cannot be empty"),

  body("travellerEmail")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Valid traveller email is required")
    .normalizeEmail(),

  // phone validation
  body("travellerPhone")
  .optional({ checkFalsy: true })
  .matches(/^[0-9]+$/)
  .withMessage("Phone number must contain numbers only"),

  body("numberOfTravellers")
    .optional()
    .isInt({ min: 1 })
    .withMessage("At least 1 traveller is required"),

  // FIXED date validation
  body("travelDate")
    .optional()
    .isISO8601()
    .withMessage("Travel date must be a valid date")
    .bail()
    .custom((value) => {
      const selectedDate = new Date(value);
      const today = new Date();

      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        throw new Error("Travel date must be a future date");
      }

      return true;
    }),

  body("bookingForSelf")
    .optional()
    .isBoolean()
    .withMessage("bookingForSelf must be true or false"),

  body("status")
    .optional()
    .isIn(["pending", "confirmed", "cancelled", "rejected"])
    .withMessage("Status must be pending, confirmed, cancelled, or rejected"),

  body("travellerPhone")
  .optional({ checkFalsy: true })
  .matches(/^[0-9]+$/)
  .withMessage("Phone number must contain numbers only"),

  validate,
];

module.exports = {
  registerValidation,
  loginValidation,
  destinationValidation,
  packageValidation,
  bookingValidation,
  bookingUpdateValidation,
};