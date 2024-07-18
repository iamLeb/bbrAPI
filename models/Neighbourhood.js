const mongoose = require('mongoose');

const NeighbourhoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

const Neighbourhood = mongoose.model("Province", NeighbourhoodSchema);
module.exports = Neighbourhood;