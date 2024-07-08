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
//     console.error('Unhandled Rejection at:', promise, 'reason:', reason);
//     if (reason.code === 'ETIMEDOUT') {
//         process.exit(1); // Exit to restart the server
//     }
// });

app.get('/up', (req, res) => {
    return res.send('Server running');
});

// Middleware to handle CORS
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = process.env.CORS.split(',');
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

const router = require('./routes/Web');
const authRoute = require('./routes/AuthRoute');

app.use(router); // other routes

app.use('/auth', authRoute); // auth routes

app.listen(port, () => console.log(`Listening on port ${port}`));
