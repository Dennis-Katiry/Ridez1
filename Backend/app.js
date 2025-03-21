const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');
const adminRoutes = require('./routes/admin.routes');

dotenv.config();
const app = express();
const cookieParser = require('cookie-parser');

connectToDb();

// Define allowed origins
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://rt5gcc3t-5173.inc1.devtunnels.ms', // Tunneling origin
];

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps or curl) or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authorization headers
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapsRoutes);
app.use('/rides', rideRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', adminRoutes);

module.exports = app;