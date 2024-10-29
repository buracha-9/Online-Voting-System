require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./server/config/corsOptions');
const { logger } = require('./server/middleware/logEvents');
const errorHandler = require('./server/middleware/errorHandler');
const verifyJWT = require('./server/middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./server/middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./server/config/dbConn');
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// CORS configuration (with options)
app.use(cors(corsOptions));

// Built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// Built-in middleware for JSON
app.use(express.json());

// Middleware to handle cookies
app.use(cookieParser());

// Serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// Public Routes
app.use('/', require('./server/routes/root'));
app.use('/register', require('./server/routes/register'));
app.use('/auth', require('./server/routes/auth'));
app.use('/refresh', require('./server/routes/refresh'));
app.use('/logout', require('./server/routes/logout'));

// Protected Routes (JWT verification required)
app.use(verifyJWT); // All routes below this line will require JWT verification
app.use('/elections', require('./server/routes/api/elections'));
app.use('/nominees', require('./server/routes/api/nominees'));
app.use('/votes', require('./server/routes/api/vote'));

// Error handling middleware
app.use(errorHandler);

// Start the server and Database
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
