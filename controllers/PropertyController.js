const Property = require("../models/Property");
const Service = require("../helpers/Services");

const create = async (req, res) => {
    try {
        const {
            title,
            address,
            price,
            bed,
            bath,
            category,
            city,
            neighbourhood,
            sqft,
            yearBuilt,
            landArea,
            description,
        } = req.body;

        if (
            !title ||
            !address ||
            !price ||
            !bed ||
            !bath ||
            !category ||
            !description
        )
            return res.status(400).json({error: "All fields are required"});

        const property = await Service.create(Property, req.body);
        if (!property)
            return res.status(400).json({error: "There was an error creating the property"});

        return res.status(200).json(property);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
};

const getAll = async (req, res) => {
    try {
        const properties = await Service.getAll(Property);
        return res.status(200).json(properties);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
};

const getOne = async (req, res) => {
    try {
        const {id} = req.params;

        const property = await Service.getOne(Property, id);
        if (!property) {
            return res.status(404).json({error: "Property not found"});
        }

        return res.status(200).json(property);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};


const update = async (req, res) => {
    try {
        const {id} = req.params;
        const property = await Service.getOne(Property, id);
        if (!property) return res.status(404).json({error: 'Property not found'});

        const {
            title,
            address,
            price,
            bed,
            bath,
            category,
            city,
            neighbourhood,
            sqft,
            yearBuilt,
            landArea,
            description
        } = req.body;
        const update = await Service.update(Property, id, req.body);
        if (!title || !address || !bed || !bath || !category || !description) {
            return res.status(400).json({error: "Not all fields inputed", update});
        }

        if (!update) return res.status(400).json({error: 'There was an error updating the property'});
        return res.status(200).json(update);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
};

const destroy = async (req, res) => {
    try {
        const {id} = req.params;
        const property = await Service.getOne(Property, id);
        if (!property) return res.status(404).json({error: 'Property not found'});

        await Service.destroy(Property, id);
        return res.status(200).json({message: 'Property destroyed'});
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
};

const getCategory = async (req, res) => {
    try {
        const {category} = req.params;
        let properties;
        if (category === 'all') {
            properties = await Service.getAll(Property)
        } else {
            properties = await Property.find({category});
        }
        console.log(properties)
        return res.status(200).json(properties);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
};

const sort = async (req, res) => {
    try {
        const {category, city, neighbourhood} = req.body;
        const query = {};

        if (category) {
            query.category = category;
        }
        if (city) {
            query.city = city;
        }
        if (neighbourhood) {
            query.neighbourhood = neighbourhood;
        }


        const properties = await Property.find(query);

        return res.status(200).json(properties);
    } catch (e) {
        return res.status(400).json({error: e.message});
    }
}

module.exports = {
    create,
    getAll,
    getOne,
    update,
    destroy,
    sort,
    getCategory
}
