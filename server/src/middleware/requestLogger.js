// @desc    Log incoming requests
// @access  Public
function requestLogger(req, res, next) {
  const now = new Date().toISOString();

  console.log(
    `[${now}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`
  );

  next();
}

module.exports = requestLogger;