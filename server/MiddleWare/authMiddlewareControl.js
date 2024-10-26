import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  try {
    // Check for token in both cookie and Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add complete user object to request
    req.user = {
      _id: decoded.userId,
      role: decoded.role,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      success: false,
      message: 'Invalid or expired authentication' 
    });
  }
};

export const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient permissions'
      });
    }
    next();
  };
};

export default authMiddleware;