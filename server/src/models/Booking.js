const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"]
    },

    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: [true, "Package is required"]
    },

    travellerName: {
      type: String,
      required: [true, "Traveller name is required"],
      trim: true
    },

    travellerEmail: {
      type: String,
      required: [true, "Traveller email is required"],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"]
    },

    travellerPhone: {
      type: String,
      required: [true, "Traveller phone is required"],
      trim: true
    },

    numberOfTravellers: {
      type: Number,
      required: [true, "Number of travellers is required"],
      min: [1, "At least 1 traveller is required"]
    },

    travelDate: {
      type: Date,
      required: [true, "Travel date is required"]
    },

    bookingForSelf: {
      type: Boolean,
      default: true
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled","rejected"],
      default: "pending"
    },

    rejectionReason: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries (important for filtering by user)
bookingSchema.index({ userId: 1 });
bookingSchema.index({ packageId: 1 });

module.exports = mongoose.model("Booking", bookingSchema);