const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. Please log in.' 
    });
  }
  next();
};

const requireGuest = (req, res, next) => {
  if (req.session.userId) {
    return res.status(403).json({ 
      success: false, 
      message: 'You are already logged in.' 
    });
  }
  next();
};

module.exports = {
  requireAuth,
  requireGuest
}; 