// @desc    Role-based access control middleware
// @access  Private (used after authenticateToken)
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    // Ensure user exists (should come from authenticateToken)
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required"
      });
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "You do not have permission to access this resource"
      });
    }

    next();
  };
}

module.exports = authorizeRole;