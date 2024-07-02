const Property = require("../models/Property");
const Media = require("../models/Media");
const Service = require("../helpers/Services");

class PropertyController {
  static create = async (req, res) => {
    try {
      const {
        price,
        category,
        address,
        title,
        bed,
        bath,
        media,
        description,
        status,
        sqft,
        yearBuilt,
        landArea,
      } = req.body;

      // check if media is an array, else throw error
      if (media && !Array.isArray(media))
        return res.status(400).json({ error: "media should be an array" });

      if (
        !title ||
        !description ||
        !price ||
        !address ||
        !category ||
        !media ||
        !bed ||
        !bath
      )
        return res.status(400).json({ error: "All fields required" });

      const property = await Service.create(Property, req.body);
      if (!property)
        return res
          .status(400)
          .json({ error: "There was an error creating the Property" });

      if (media.length > 0) {
        const mediaPromises = media.map(async (m) => {
          const data = {
            type: m.type,
            url: m.url,
            ownerId: property.id,
            name: m.name,
          };

          await Service.create(Media, data);
        });

        await Promise.all(mediaPromises);
      }

      const p = await Property.findById(property.id).populate("media").exec();

      return res.status(200).json(p);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  };

  static getAll = async (req, res) => {
    try {
      const { page = 1, limit = 2 } = req.query;
      const skip = (page - 1) * limit;

      const properties = await Property.find()
        .populate("media")
        .skip(skip)
        .limit(limit)
        .exec();

      // Optional: Get total count for pagination metadata
      const totalProperties = await Property.countDocuments();

      return res.status(200).json({
        properties,
        totalProperties,
        totalPages: Math.ceil(totalProperties / limit),
        currentPage: page,
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  };

  static getOne = async (req, res) => {
    try {
      const { id } = req.params;

      const property = await Property.findById(id).populate("media").exec();
      return res.status(200).json(p);
    } catch (error) {
      return res.status(500).json({ error: e.message });
    }
  };
}

module.exports = PropertyController;
