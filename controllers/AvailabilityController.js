const Service = require("../helpers/Services");
const Availability = require("../models/Availability");

const create = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;

    if (!date || !startTime || !endTime) {
      return res
        .status(400)
        .json({ error: "All fields (date, startTime, endTime) are required" });
    }

    // Parse the date strings into Date objects
    const parsedDate = new Date(date);
    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);

    // Validate parsed dates
    if (
      isNaN(parsedDate.getTime()) ||
      isNaN(parsedStartTime.getTime()) ||
      isNaN(parsedEndTime.getTime())
    ) {
      return res.status(400).json({ error: "Invalid date or time format" });
    }

    // Find existing availability for the same date
    const existingAvailability = await Availability.findOne({
      date: parsedDate,
    });

    if (existingAvailability) {
      // Check if the new time range exactly matches the existing one
      if (
        parsedStartTime.getTime() ===
          existingAvailability.startTime.getTime() &&
        parsedEndTime.getTime() === existingAvailability.endTime.getTime()
      ) {
        return res.status(400).json({
          error: "Duplicate availability. This time slot already exists.",
        });
      }
      // Check if the new time range extends the existing one
      if (
        parsedStartTime < existingAvailability.startTime ||
        parsedEndTime > existingAvailability.endTime
      ) {
        // Update the existing availability with extended time range
        existingAvailability.startTime =
          parsedStartTime < existingAvailability.startTime
            ? parsedStartTime
            : existingAvailability.startTime;
        existingAvailability.endTime =
          parsedEndTime > existingAvailability.endTime
            ? parsedEndTime
            : existingAvailability.endTime;

        const updatedAvailability = await existingAvailability.save();
        return res.status(200).json(updatedAvailability);
      } else {
        // The new time range is within the existing one, so we don't need to update
        return res.status(400).json({
          error: "An availability that covers this time range already exists.",
        });
      }
    }

    // If no existing availability, create a new one
    const availability = await Service.create(Availability, {
      date: parsedDate,
      startTime: parsedStartTime,
      endTime: parsedEndTime,
    });

    if (!availability) {
      return res
        .status(400)
        .json({ error: "There was an error creating the availability" });
    }

    return res.status(201).json(availability);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

//get the Availability by date field
const getOne = async (req, res) => {
  try {
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({ error: "Date parameter is required" });
    }

    const parsedDate = new Date(date);

    parsedDate.setHours(0, 0, 0, 0);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const availability = await Availability.findOne({
      date: parsedDate,
    });

    if (!availability) {
      return res.status(200).json({ notAvailable: true });
    }

    return res.status(200).json(availability);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

module.exports = {
  create,
  getOne,
};
