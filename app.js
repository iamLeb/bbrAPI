const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
require('./databases/Connect');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/up', (req, res) => {
    return res.send('Server running');
});

const corsOptions = {
    origin: process.env.VITE_CORS, // Allow only this origin
    optionsSuccessStatus: 204,
    "methods": "GET,PUT,PATCH,HEAD,POST", // Allow only these methods
    credentials: true
};
  
  // Use CORS middleware with options
  app.use(cors(corsOptions));
  

const router = require('./routes/Web');
const authRoute = require('./routes/AuthRoute');

app.use(router); // other routes

app.use('/auth', authRoute); // auth routes


app.listen(port, () => console.log(`Listening on port ${port}`));