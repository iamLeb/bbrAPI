const mongoose = require('mongoose');

const ProvinceSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
}, { timestamps: true });

const Province = mongoose.model("Province",ProvinceSchema);
module.exports = Province;