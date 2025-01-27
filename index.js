const express = require("express");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const doctorRouter = require("./routes/doctorRouter");
const currentDB = require("./config/connectDB");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
app.use(express.json());

const PORT = process.env.PORT || 4000; 

app.use('/api/user',userRoute)
app.use('/api/doctor',doctorRouter)
app.use('/api/admin',adminRoute)

currentDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
