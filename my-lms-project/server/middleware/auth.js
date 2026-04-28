// server/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// This function is our "middleware"
module.exports = function(req, res, next) {
  // 1. Get the token from the request header
  // We'll send this from React (Axios)
  const token = req.header('x-auth-token');

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // 3. If token exists, verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Add the user's ID from the token to the request object
    // This makes req.user available in our protected API routes
    req.user = decoded.user;
    
    // 5. Move on to the next function (the API endpoint)
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};