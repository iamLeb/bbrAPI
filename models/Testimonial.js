const mongoose = require('mongoose');

const TestimonialSchema= new mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    }
}, { timestamps:true });

const Testimonial= mongoose.model("Testimonial",TestimonialSchema);
module.exports = Testimonial;