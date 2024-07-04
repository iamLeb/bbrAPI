const mongoose = require('mongose');

const NeighbourhoodSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
}, { timestamps: true });

const Neighbourhood = mongoose.model("Neighbourhood",NeighbourhoodSchema);
module.exports = Neighbourhood;