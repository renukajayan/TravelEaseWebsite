const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Package title is required"],
      trim: true
    },

    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: [true, "Destination is required"]
    },

    durationDays: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 day"]
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },

    features: {
      type: [String],
      default: []
    },

    placesIncluded: {
      type: [String],
      default: []
    },

    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
      match: [/^https?:\/\/.+/, "Please use a valid URL"]
    },

    availableSlots: {
      type: Number,
      required: [true, "Available slots are required"],
      min: [0, "Available slots cannot be negative"]
    }
  },
  {
    timestamps: true
  }
);

// Indexes for performance
packageSchema.index({ destinationId: 1 });
packageSchema.index({ price: 1 });
packageSchema.index({ durationDays: 1 });

module.exports = mongoose.model("Package", packageSchema);