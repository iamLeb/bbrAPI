const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
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
      type: String,
      enum: ["rent", "sale", "default"],
      default: "default",
    },
    description: {
      type: String,
      required: true,
    },
    video: {
      type: String,
    },
    // media: {
    //   type: [],
    //   ref: "Media",
    // },
  },
  { timestamps: true }
);

// Virtual property to fetch media where ownerId is propertyId
PropertySchema.virtual('media', {
    ref: 'Media',
    localField: '_id',
    foreignField: 'ownerId',
    justOne: false,
  });
  
  // Ensure virtual fields are included when converting to JSON or Object
  PropertySchema.set('toObject', { virtuals: true });
  PropertySchema.set('toJSON', { virtuals: true });

const Property = mongoose.model("Property", PropertySchema);

module.exports = Property;
