const Service = require('../helpers/Services');
const Gallery = require('../models/Gallery');

const create = async (req, res) => {
    try {
        const { image, province } = req.body;
        if (!image || !province) return res.status(400).json({error: 'All fields are required'});

        const exist = await Service.getByField(Gallery, 'province', province);
        if (exist) return res.status(400).json({error: 'Gallery already exists'});

        const gallery = await Service.create(Gallery, req.body);
        if (!gallery) return res.status(400).json({error: 'There was an error creating the Gallery'});

        return res.status(201).json(gallery);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const getAll = async (req, res) => {
    try {
        const gallery = await Service.getAll(Gallery);
        return res.status(200).json(gallery);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const gallery = await Service.getOne(Gallery, id);
        if (!gallery) return res.status(404).json({error: 'Gallery not found'});

        return res.status(200).json(gallery);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;

        const findId = await Service.getOne(Gallery, id);
        if(!findId) return res.status(404).json({error: 'Gallery not found'});

        const { image, province } = req.body;
        if (!image || !province) return res.status(400).json({error: 'All fields are required'});

        const exist = await Service.getByField(Gallery, 'province', province);
        if (exist && exist._id.toString() !== id) return res.status(400).json({error: 'Gallery already exists'});

        const updatedGallery = await Service.update(Gallery, id, req.body);
        if (!updatedGallery) return res.status(400).json({error: 'There was an error updating the gallery'});

        return res.status(200).json(updatedGallery);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const findId = await Service.getOne(Gallery, id);
        if(!findId) return res.status(404).json({error: 'Gallery not found'});

        await Service.destroy(Gallery, id);
        return res.status(200).json({message: 'Gallery destroyed'});
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

module.exports = {
    create,
    getAll,
    getOne,
    update,
    destroy
}
