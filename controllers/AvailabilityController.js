const Service = require("../helpers/Services");
const Availability = require("../models/Availability");
const Booking = require("../models/Booking");
const Contact = require("../models/Contact");

const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the availability ID is passed as a route parameter

    // Find the availability
    const availability = await Availability.findById(id);

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    // Get all booking IDs associated with this availability
    const bookingIds = availability.bookings;

    // Delete all associated bookings and collect their contact IDs
    const contactIds = new Set();
    for (const bookingId of bookingIds) {
      const booking = await Booking.findById(bookingId);
      if (booking) {
        if (booking.contact) {
          contactIds.add(booking.contact.toString());
        }
        await Booking.findByIdAndDelete(bookingId);
      }
    }

    // Delete all collected contacts
    for (const contactId of contactIds) {
      await Contact.findByIdAndDelete(contactId);
    }

    // Delete the availability itself
    await Availability.findByIdAndDelete(id);

    res.status(200).json({
      message: "Availability and associated booking data with contacts deleted successfully",
      deletedAvailability: availability,
      deletedBookingsCount: bookingIds.length,
      deletedContactsCount: contactIds.size,
    });
  } catch (error) {
    console.error("Error deleting availability:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting availability" });
  }
};

const update = async (req, res) => {
  try {
    const { date, startTime, endTime, oldDate } = req.body;

    if (!date || !startTime || !endTime || !oldDate) {
      return res.status(400).json({
        message: "All fields (date, startTime, endTime, oldDate) are required",
      });
    }

    // Parse the date strings into Date objects
    const parsedDate = new Date(date);
    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);
    const parsedOldDate = new Date(oldDate);

    // Validate parsed dates
    if (
      isNaN(parsedDate.getTime()) ||
      isNaN(parsedStartTime.getTime()) ||
      isNaN(parsedEndTime.getTime()) ||
      isNaN(parsedOldDate.getTime())
    ) {
      return res.status(400).json({ message: "Invalid date or time format" });
    }

    // Check if startTime is less than endTime
    if (parsedStartTime >= parsedEndTime) {
      return res
        .status(400)
        .json({ message: "Start time must be before end time" });
    }

    if (
      parsedStartTime.getMinutes() % 15 !== 0 ||
      parsedEndTime.getMinutes() % 15 !== 0
    ) {
      return res.status(400).json({
        message: "Start time and end time must be multiples of 15 minutes.",
      });
    }

    // This check is done only if there is a change in date
    if (parsedDate.getTime() !== parsedOldDate.getTime()) {
      // Check if there is existing availability for the new date
      const existingAvailabilityForNewDate = await Availability.findOne({
        date: parsedDate,
      });

      if (existingAvailabilityForNewDate) {
        return res.status(400).json({
          message: "Availability for the changing date already exists.",
        });
      }
    }

    // Find existing availability for the old date
    const existingAvailabilityForOldDate = await Availability.findOne({
      date: parsedOldDate,
    });

    // Check if the old availability has bookings
    if (
      existingAvailabilityForOldDate &&
      existingAvailabilityForOldDate.bookings &&
      existingAvailabilityForOldDate.bookings.length > 0
    ) {
      const availability = await Availability.findOne({ date: parsedOldDate })
        .populate({
          path: "bookings",
          options: { sort: { startTime: 1 } },
        })
        .lean();

      const bookings = availability.bookings;

      // Find the earliest booking start time and the latest booking end time
      const earliestBookingStartTime = Math.min(
        ...bookings.map((booking) => new Date(booking.startTime).getTime())
      );
      const latestBookingEndTime = Math.max(
        ...bookings.map((booking) => new Date(booking.endTime).getTime())
      );

      // Check if parsedStartTime and parsedEndTime encompass all the bookings
      const encompassesAllBookings =
        parsedStartTime.getTime() <= earliestBookingStartTime &&
        parsedEndTime.getTime() >= latestBookingEndTime;

      if (!encompassesAllBookings) {
        return res.status(400).json({
          message:
            " The new time range for availability does not encompass all existing bookings.",
        });
      }

      // Update the existing availability
      existingAvailabilityForOldDate.date = parsedDate;
      existingAvailabilityForOldDate.startTime = new Date(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
        parsedStartTime.getHours(),
        parsedStartTime.getMinutes()
      );

      existingAvailabilityForOldDate.endTime = new Date(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
        parsedEndTime.getHours(),
        parsedEndTime.getMinutes()
      );
      // Update all bookings' startTime and endTime
      const bookingUpdatePromises = existingAvailabilityForOldDate.bookings.map(
        async (bookingId) => {
          const booking = await Booking.findById(bookingId);
          if (booking) {
            const oldStartTime = new Date(booking.startTime);
            const oldEndTime = new Date(booking.endTime);

            booking.startTime = new Date(
              parsedDate.getFullYear(),
              parsedDate.getMonth(),
              parsedDate.getDate(),
              oldStartTime.getHours(),
              oldStartTime.getMinutes()
            );

            booking.endTime = new Date(
              parsedDate.getFullYear(),
              parsedDate.getMonth(),
              parsedDate.getDate(),
              oldEndTime.getHours(),
              oldEndTime.getMinutes()
            );

            return booking.save();
          }
        }
      );

      // Wait for all booking updates to complete
      await Promise.all(bookingUpdatePromises);

      await existingAvailabilityForOldDate.save();

      return res.status(200).json({
        message: "Availability updated successfully",
        availability: existingAvailabilityForOldDate,
      });
    }

    // Update the existing availability
    existingAvailabilityForOldDate.date = parsedDate;
    existingAvailabilityForOldDate.startTime = parsedStartTime;
    existingAvailabilityForOldDate.endTime = parsedEndTime;
    await existingAvailabilityForOldDate.save();

    res.status(200).json({
      message: "Availability updated successfully",
      existingAvailabilityForOldDate,
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating availability" });
  }
};

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

    // Check if parsedStartTime is less than parsedEndTime
    if (parsedStartTime >= parsedEndTime) {
      return res
        .status(400)
        .json({ error: "Start time must be before end time" });
    }

    // Calculate the difference in minutes
    const timeDifference = (parsedEndTime - parsedStartTime) / (1000 * 60);

    // Check if the difference is a multiple of 15 minutes
    if (timeDifference % 15 !== 0) {
      return res
        .status(400)
        .json({ error: "Time difference must be a multiple of 15 minutes" });
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
        // Updates the existing availability with extended time range
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

const getThreeMonthAvailability = async (req, res) => {
  try {
    const { year, month } = req.params;

    // Calculate start date (first day of previous month)
    const startDate = new Date(Number(year), Number(month) - 2, 1);

    // Calculate end date (last day of next month)
    const endDate = new Date(Number(year), Number(month) + 1, 0);

    const availabilities = await Availability.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate("bookings"); // Populate the bookings

    const availabilityMap = {};

    availabilities.forEach((av) => {
      const dateKey = av.date.toISOString().split("T")[0];
      availabilityMap[dateKey] = {
        isAvailable: true,
        startTime: av.startTime.toISOString().split("T")[1].substring(0, 5),
        endTime: av.endTime.toISOString().split("T")[1].substring(0, 5),
        bookings: av.bookings.map((booking) => ({
          startTime: booking.startTime.toISOString(),
          endTime: booking.endTime.toISOString(),
          duration: booking.duration,
        })),
      };
    });
    return res.status(200).json(availabilityMap);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

const getAll = async (req, res) => {
  try {
    const availabilities = await Availability.find({})
      .sort({ date: 1 })
      .populate({
        path: "bookings",
        options: { sort: { startTime: 1 } },
        populate: {
          path: "contact",
        },
      })
      .lean();

    if (!availabilities || availabilities.length === 0) {
      return res.status(404).json({ message: "No availabilities found" });
    }

    return res.status(200).json(availabilities);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

module.exports = {
  create,
  getOne,
  getThreeMonthAvailability,
  getAll,
  update,
  deleteAvailability,
};
