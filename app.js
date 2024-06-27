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

app.use(cors({
    origin: true,
    credentials: true
}));

const router = require('./routes/Web');
const authRoute = require('./routes/AuthRoute');

app.use(router); // other routes

app.use('/auth', authRoute); // auth routes


app.listen(port, () => console.log(`Listening on port ${port}`));