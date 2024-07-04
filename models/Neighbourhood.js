const mongoose = require('mongoOse');

const NeighbourhoodSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
}, { timestamps: true });

const Neighbourhood = mongoose.model("Neighbourhood",NeighbourhoodSchema);
module.exports = Neighbourhood;