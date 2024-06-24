const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const GallerySchema=new mongoose.Schema({
  image: {
      type: String,
      required: true
  },
  province:{
     type:Schema.Types.ObjectId,
      ref:"Province",
      required:true
  }
}, { timestamps: true });

const Gallery=mongoose.model("Gallery",GallerySchema);
module.exports = Gallery;