const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Destination name is required"],
      trim: true
    },

    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },

    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
      match: [/^https?:\/\/.+/, "Please use a valid URL"]
    },

    currency: {
      type: String,
      required: [true, "Currency is required"],
      trim: true,
      uppercase: true
    },

    bestSeason: {
      type: String,
      required: [true, "Best season is required"],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster search/filter
destinationSchema.index({ name: 1 });
destinationSchema.index({ country: 1 });

module.exports = mongoose.model("Destination", destinationSchema);