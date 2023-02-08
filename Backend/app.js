// Package Imports
const express = require('express');
const bodyParser= require('body-parser'); 
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Node Modules Imports
const fs = require('fs');
const path = require('path');
const https = require('https');

// .env Imports and config
const dotenv = require('dotenv');
dotenv.config();

// Routes Imports
const expensesRoutes = require('./routes/expenses'); 
const userRoutes = require('./routes/users.js');
const premiumRoutes = require('./routes/premium.js');
const leaderboardRoutes = require('./routes/leaderboard.js');
const passwordRoutes = require('./routes/password.js'); 

const app = express(); // Initializing the backend

// Initilizing https
// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

// Initialzing logging Files
const accessLogFiles = fs.createWriteStream(
    path.join(__dirname, 'access.log'), 
    { flags: 'a' }
)

// Initializing Middleware
app.use(cors()); 
app.use(bodyParser.json({ extended: false }));
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogFiles})); 

// Expenses Routes
app.use('/expenses', expensesRoutes);
app.use('/user', userRoutes);
app.use('/premium', premiumRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/password', passwordRoutes);

// Deployment Home Route
// app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, `frontend/${req.url}`));
// });

// Error Routes
app.use((req, res) => {
    res.status(404).send(`<h1> Page Not Found </h1>`);
});

mongoose
  .connect('mongodb+srv://admin:Chickoo11@cluster0.8kpvn6a.mongodb.net/expense-tracker')
  .then(result => {
    console.log('Connected To MongoDB');
    app.listen(5005)
  })
  .catch(err => {
    console.log(err);
  });