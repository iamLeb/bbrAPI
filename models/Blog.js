const mongoose = require('mongoose')
const {Schema} = require("mongoose");

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,

    }
}, { timestamps: true });


const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;