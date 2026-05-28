const mongoose = require("mongoose");

// @desc    Validate MongoDB ObjectId in route params
// @access  Public (used in routes)
function validateObjectId(paramName = "id") {
  return (req, res, next) => {
    const value = req.params[paramName];

    if (!value || !mongoose.Types.ObjectId.isValid(value)) {
      return res.status(400).json({
        error: `Invalid or missing ${paramName}`
      });
    }

    next();
  };
}

module.exports = validateObjectId;