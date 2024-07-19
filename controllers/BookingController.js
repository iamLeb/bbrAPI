const Booking = require("../models/Booking"); // Adjust the path as needed
const Availability = require("../models/Availability"); // Adjust the path as needed
const Service = require("../helpers/Services"); // Adjust the path as needed

const bookingController = {
  create: async (req, res) => {
    try {
      const { date, startTime, endTime, duration,contactId } = req.body;

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

      const bookingData = {
        startTime,
        endTime,
        duration,
        availability: availability._id,
        contact:contactId,

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

  update: async (req, res) => {
    try {
      const updatedBooking = await Service.update(
        Booking,
        req.params.id,
        req.body
      );
      if (!updatedBooking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.status(200).json(updatedBooking);
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
