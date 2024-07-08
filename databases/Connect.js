const mongoose = require('mongoose')

console.log("Attempt Connect to DB")
const connect = mongoose.connect(process.env.DB);

console.log(connect ? 'Connected!' : 'Error Connecting to database!');

module.exports = connect;