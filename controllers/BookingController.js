const Booking = require("../models/Booking"); // Adjust the path as needed
const Availability = require("../models/Availability"); // Adjust the path as needed
const Service = require("../helpers/Services"); // Adjust the path as needed

const bookingController = {
  create: async (req, res) => {
    try {
      let { date, startTime, endTime, duration, contactId } = req.body;

      if (!date || !startTime || !endTime || !duration) {
        return res.status(400).json({
          error: "All fields  are required",
        });
      }

      //Check if the availability exists
      const availability = await Availability.findOne({
        date: new Date(date),
      });

      if (!availability) {
        return res.status(404).json({ error: "Availability not found" });
      }

      // Check if the booking time is within the availability time
      if (
        new Date(startTime) < availability.startTime ||
        new Date(endTime) > availability.endTime
      ) {
        return res
          .status(400)
          .json({ error: "Booking time is outside of available time" });
      }

      startTime = new Date(startTime).setSeconds(0, 0);
      endTime = new Date(endTime).setSeconds(0, 0);

      // Add 15 minutes to the endTime
      endTime = new Date(endTime).setMinutes(
        new Date(endTime).getMinutes() + 15
      );

      const bookingData = {
        startTime,
        endTime,
        duration,
        availability: availability._id,
        contact: contactId,
      };

      const booking = await Service.create(Booking, bookingData);

      //Update the availability to include this booking
      await Service.update(Availability, availability._id, {
        $push: { bookings: booking._id },
      });

      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id,availability, startTime, endTime } = req.body;

      // Step 1: Find the existing booking
      const existingBooking = await Booking.findById(id);
      if (!existingBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Step 2: Find the associated availability
      const associatedAvailability = await Availability.findById(
        availability
      ).populate("bookings");
      if (!associatedAvailability) {
        return res
          .status(404)
          .json({ message: "Associated availability not found" });
      }

      // New Step: Check if startTime is smaller than endTime
      if (new Date(startTime) >= new Date(endTime)) {
        return res
          .status(400)
          .json({ message: "Start time must be earlier than end time" });
      }

      // New Step: Check if startTime and endTime are multiples of 15 minutes
      const isMultipleOf15Minutes = (date) => {
        return (
          date.getMinutes() % 15 === 0 &&
          date.getSeconds() === 0 &&
          date.getMilliseconds() === 0
        );
      };

      if (
        !isMultipleOf15Minutes(new Date(startTime)) ||
        !isMultipleOf15Minutes(new Date(endTime))
      ) {
        return res.status(400).json({
          message: "Start time and end time must be multiples of 15 minutes",
        });
      }

      console.log("startTime", startTime, "endTime", endTime);
      console.log("bokinf timestart", new Date(existingBooking.startTime));
      console.log("bokinf timeend", new Date(existingBooking.endTime));

      // Step 3: Check if the new booking fits within the availability's time range
      if (
        new Date(associatedAvailability.startTime) > new Date(startTime) ||
        new Date(endTime) > new Date(associatedAvailability.endTime)
      ) {
        return res
          .status(400)
          .json({ message: "Booking time is outside of availability range" });
      }

      // Step 4: Check for overlaps with existing bookings
      const hasOverlap = associatedAvailability.bookings.some((booking) => {
        if (booking._id.toString() === id) return false; // Skip the current booking
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);
        const newStart = new Date(startTime);
        const newEnd = new Date(endTime);
        return newStart < bookingEnd && bookingStart < newEnd;
      });

      if (hasOverlap) {
        return res.status(400).json({
          message: "The requested time slot overlaps with an existing booking",
        });
      }

      // Step 5: Update the booking
      existingBooking.startTime = startTime;
      existingBooking.endTime = endTime;
      // Calculate and update the duration
      const durationInMilliseconds = new Date(endTime) - new Date(startTime);
      existingBooking.duration = Math.round(
        durationInMilliseconds / (1000 * 60)
      );
      console.log("Existing booking:", existingBooking);
      
      // Convert to minutes
      const updatedBooking = await existingBooking.save();
      res.status(200).json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const bookings = await Service.getAll(Booking);
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const booking = await Service.getOne(Booking, req.params.id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const deletedBooking = await Service.destroy(Booking, req.params.id);
      if (!deletedBooking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      // Remove the booking reference from the availability
      await Service.update(Availability, deletedBooking.availability, {
        $pull: { bookings: deletedBooking._id },
      });

      res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = bookingController;
