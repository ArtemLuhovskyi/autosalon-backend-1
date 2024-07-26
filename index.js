const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
require("dotenv").config();
const bodyParser = require('body-parser');

app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
// Middleware setup
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  })
  
  app.use(cors({
      origin: '*', 
      credentials: true,
      optionsSuccessStatus: 200
  }));
  app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
  app.use(bodyParser.json({limit: '50mb'}));


const carRoutes = require('./routes/carRoutes');

app.use('/', carRoutes);


const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server running on link: http://localhost:${PORT}`);
});