const mongoose = require('mongoose')

const connect = mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000 // 45 seconds
});

console.log(connect ? 'Connected!' : 'Error Connecting to database!');

module.exports = connect;