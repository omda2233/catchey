// Middleware to check user role
const roleMiddleware = function(...requiredRoles) {
  const roles = requiredRoles.flat();
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient role' });
    }
    next();
  };
};

export default roleMiddleware;
