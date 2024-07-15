const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const PropertySchema = new mongoose.Schema(
    {
        price: {
            type: String,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        city: {
            type: String,
            required: true
        },
        neighbourhood: {
            type: Schema.Types.ObjectId,
            ref: "Neighbourhood",
            required: true
        },
        address: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        bed: {
            type: Number,
            required: true,
        },
        bath: {
            type: Number,
            required: true,
        },
        sqft: {
            type: Number,
        },
        yearBuilt: {
            type: Number,
        },
        landArea: {
            type: Number,
        },
        status: {
            type: Boolean,
            default: 1,
        },
        description: {
            type: String,
            required: true,
        },
        video: {
            type: String,
        }
    },
    {timestamps: true}
);


const Property = mongoose.model("Property", PropertySchema);

module.exports = Property;
