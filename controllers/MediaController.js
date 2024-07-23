const Service = require("../helpers/Services");
const Media = require("../models/Media");

const create = async (req, res) => {
    try {
        const {type, url, ownerId, name} = req.body;
        if (!type || !url || !ownerId || !name)
            return res.status(400).json({error: "All fields required"});

        const media = await Service.create(Media, req.body);
        if (!media)
            return res
                .status(400)
                .json({error: "There was an error creating the Media"});

        return res.status(200).json(media);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

const getMediaForOwner = async (req, res) => {
    try {
        const {ownerId} = req.params;
        const media = await Service.getByField(Media, "ownerId", ownerId);
        if (!media) return res.status(404).json({error: "Media not found"});

        return res.status(200).json(media);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

const getMultipleMedia = async (req, res) => {
    try {
        const {ownerId} = req.params;
        const media = await Service.findAll(Media, "ownerId", ownerId);
        if (!media.length) return res.status(404).json({error: "Media not found"});

        return res.status(200).json(media);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }

}

const getAll = async (req, res) => {
    try {
        const media = await Service.getAll(Media);
        return res.status(200).json(media);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

const getOne = async (req, res) => {
    try {
        const {id} = req.params;
        const media = await Service.getOne(Media, id);
        if (!media) return res.status(404).json({error: "Media not found"});

        return res.status(200).json(media);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

const destroy = async (req, res) => {
    try {
        const {id} = req.params;

        const findId = await Service.getOne(Media, id);
        if (!findId) return res.status(404).json({error: "Media not found"});

        await Service.destroy(Media, id);
        return res.status(200).json({message: "Media deleted"});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

const update = async (req, res) => {
    try {
        const {id} = req.params;

        const findId = await Service.getOne(Media, id);
        if (!findId) return res.status(404).json({error: "Media not found"});

        const updatedMedia = await Service.update(Media, id, req.body);
        if (!updatedMedia)
            return res.status(400).json({error: "There was an error updating the Media"});

        return res.status(200).json(updatedMedia);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }

}

module.exports = {
    create,
    getMediaForOwner,
    getAll,
    getOne,
    destroy,
    update,
    getMultipleMedia
}
