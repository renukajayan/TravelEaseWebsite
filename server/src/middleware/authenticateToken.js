const jwt = require("jsonwebtoken");

// @desc    Protect routes (JWT authentication)
// @access  Private
function authenticateToken(req, res, next) {
  let token;

  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };

      next();
    } catch (error) {
      console.error("JWT Error:", error.message);

      return res.status(401).json({
        error: "Invalid or expired token"
      });
    }
  } else {
    return res.status(401).json({
      error: "Authorization token missing"
    });
  }
}

module.exports = authenticateToken;