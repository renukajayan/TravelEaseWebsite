// @desc    Handle unknown routes (404)
// @access  Public
function notFound(req, res, next) {
  res.status(404).json({
    error: `Route not found - ${req.originalUrl}`
  });
}

module.exports = notFound;