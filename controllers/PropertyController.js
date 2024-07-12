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
                description,
                sqft,
                yearBuilt,
                landArea,
            } = req.body;

            // Check if media is an array, else throw error
            if (media && !Array.isArray(media))
                return res.status(400).json({ error: "Media should be an array" });

            if (
                !title ||
                !description ||
                !price ||
                !address ||
                !category ||
                !bed ||
                !bath
            )
                return res.status(400).json({ error: "All fields are required" });

            const property = await Service.create(Property, req.body);
            if (!property)
                return res
                    .status(400)
                    .json({ error: "There was an error creating the property" });

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

            const populatedProperty = await Property.findById(property.id).populate("media").exec();

            return res.status(200).json(populatedProperty);
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
            if (!property) {
                return res.status(404).json({ error: "Property not found" });
            }

            return res.status(200).json(property);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    };

    static destroy = async (req, res) => {
        try {
            const { id } = req.params;
            const property = await Service.getOne(Property, id);
            if (!property) return res.status(404).json({ error: 'Property not found' });

            // Delete associated media
            await Media.deleteMany({ ownerId: id });

            await Service.destroy(Property, id);
            return res.status(200).json({ message: 'Property destroyed' });
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    };
}

module.exports = PropertyController;
