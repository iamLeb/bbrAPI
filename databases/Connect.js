const mongoose = require('mongoose')

const connect = mongoose.connect(process.env.DB);

console.log(connect ? 'Connected!' : 'Error Connecting to database!');

module.exports = connect;