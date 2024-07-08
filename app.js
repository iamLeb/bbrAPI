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

// Handle uncaught exceptions and unhandled promise rejections
// process.on('uncaughtException', (err) => {
//     console.error('Uncaught Exception:', err);
//     if (err.code === 'ETIMEDOUT') {
//       process.exit(1); // Exit to restart the server
//     }
// });

// process.on('unhandledRejection', (reason, promise) => {
// console.error('Unhandled Rejection at:', promise, 'reason:', reason);
// if (reason.code === 'ETIMEDOUT') {
//     process.exit(1); // Exit to restart the server
// }
// });


app.get('/up', (req, res) => {
    return res.send('Server running');
});

// const corsOptions = {
//     origin: process.env.CORS, // Allow only this origin
//     optionsSuccessStatus: 204,
//     "methods": "GET,PUT,PATCH,HEAD,POST", // Allow only these methods
// };
  
  // Use CORS middleware with options
  app.use(cors({
    origin: 'https://bbrclient.onrender.com',
    credentials: true   
  }));
  

const router = require('./routes/Web');
const authRoute = require('./routes/AuthRoute');

app.use(router); // other routes

app.use('/auth', authRoute); // auth routes


app.listen(port, () => console.log(`Listening on port ${port}`));