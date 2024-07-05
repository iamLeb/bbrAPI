const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const GallerySchema=new mongoose.Schema({
  image: {
      type: String,
      required: true
  },
  neighbourhood:{
     type:Schema.Types.ObjectId,
      ref:"Neighbourhood",
      required:true
  }
}, { timestamps: true });

const Gallery=mongoose.model("Gallery",GallerySchema);
module.exports = Gallery;