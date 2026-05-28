// @desc    Global error handler middleware
// @access  Public
function errorHandler(err, req, res, next) {
  // Log error (for debugging on server)
  console.error("ERROR:", err.message);
  console.error(err.stack);

  // Use existing status or default to 500
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    error: err.message || "Internal server error"
  });
}

module.exports = errorHandler;