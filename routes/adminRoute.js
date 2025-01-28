const adminRoute = require('express').Router()
const jwt = require('jsonwebtoken')

const {adminLogin,adminRegister,getDashboard,adminLogout} = require('../controllers/adminController');


const authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded; // Attach decoded user to the request
    next();
  });
};

const blacklistedTokens = new Set();


const isTokenValid = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ message: 'Token is invalid or blacklisted' });
  }
  next();
};


// admin
adminRoute.post('/',adminLogin)
adminRoute.post('/register',adminRegister)
adminRoute.get('/dashboard',authenticate,getDashboard)
adminRoute.post('/logout',isTokenValid,adminLogout)

module.exports = adminRoute