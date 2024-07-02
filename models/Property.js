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
    medias: {
      type: [Schema.Types.ObjectId],
      ref: "Media",
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", PropertySchema);

module.exports = Property;
