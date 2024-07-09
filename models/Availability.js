const mongoose = require("mongoose");

const AvailabilitySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

AvailabilitySchema.index({ date: 1 });

const Availability = mongoose.model("Availability", AvailabilitySchema);

module.exports = Availability;
