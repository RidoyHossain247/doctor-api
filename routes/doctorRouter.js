const doctorRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const {doctorController,getDoctor,appointmentsCreate,getAppointments} = require('../controllers/doctorController');

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

doctorRouter.get('/',getDoctor)
doctorRouter.post('/create',doctorController)
doctorRouter.post('/appointments/create',appointmentsCreate)
doctorRouter.get('/appointments',getAppointments)


module.exports = doctorRouter