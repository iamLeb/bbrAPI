const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const CommentSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    message: {
        type: String,
        required: true,
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;