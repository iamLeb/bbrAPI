const Service = require('../helpers/Services');
const Province = require('../models/Province');

const create = async (req, res) => {
    try {
        const {name} = req.body;
        if (!name) return res.status(400).json({error: 'Province name is required'});

        const exist = await Service.getByField(Province, 'name', name);
        if (exist) return res.status(400).json({error: 'Province already exists'});

        const province = await Service.create(Province, req.body);
        if (!province) return res.status(400).json({error: 'There was an error creating the province'});

        return res.status(201).json(province);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const getAll = async (req, res) => {
    try {
        const provinces = await Service.getAll(Province);
        return res.status(200).json(provinces);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const getOne = async (req, res) => {
    try {
        const {id} = req.params;
        const province = await Service.getOne(Province, id);
        if (!province) return res.status(404).json({error: 'Province not found'});

        return res.status(200).json(province);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const update = async (req, res) => {
    try {
        const {id} = req.params;

        const findId = await Service.getOne(Province, id);
        if (!findId) return res.status(404).json({error: 'Province not found'});

        const {name} = req.body;
        if (!name) return res.status(400).json({error: 'Province name is required'});

        const exist = await Service.getByField(Province, 'name', name);
        if (exist && exist._id.toString() !== id) return res.status(400).json({error: 'Province already exists'});

        const updatedProvince = await Service.update(Province, id, req.body);
        if (!updatedProvince) return res.status(400).json({error: 'There was an error updating the province'});

        return res.status(200).json(updatedProvince);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }

    const destroy = async (req, res) => {
        try {
            const {id} = req.params;

            const findId = await Service.getOne(Province, id);
            if (!findId) return res.status(404).json({error: 'Province not found'});

            await Service.destroy(Province, id);
            return res.status(200).json({message: 'Province destroyed'});
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
}