const Service = require('../helpers/Services');
const Neighbourhood = require('../models/Neighbourhood');
const Category = require("../models/Category");

const create = async (req, res) => {
    try {
        const {name} = req.body;
        if (!name) return res.status(400).json({error: 'Neighbourhood name is required'});

        const exist = await Service.getByField(Neighbourhood, 'name', name);
        if (exist) {
            if (!exist.active) {
                exist.active = true;
                await exist.save();
                return res.status(201).json(exist);
            } else {
                return res.status(400).json({error: 'Neighbourhood already exists'});
            }
        }
        const neighbourhood = await Service.create(Neighbourhood, req.body);
        if (!neighbourhood) return res.status(400).json({error: 'There was an error creating the neighbourhood'});

        return res.status(201).json(neighbourhood);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const getAll = async (req, res) => {
    try {
        const neighbourhoods = await Service.getAll(Neighbourhood);
        return res.status(200).json(neighbourhoods);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const getOne = async (req, res) => {
    try {
        const {id} = req.params;
        const neighbourhood = await Service.getOne(Neighbourhood, id);
        if (!neighbourhood) return res.status(404).json({error: 'Neighbourhood not found'});

        return res.status(200).json(neighbourhood);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const update = async (req, res) => {
    try {
        const {id} = req.params;

        const findId = await Service.getOne(Neighbourhood, id);
        if (!findId) return res.status(404).json({error: 'Neighbourhood not found'});

        const {name} = req.body;
        if (!name) return res.status(400).json({error: 'Neighbourhood name is required'});

        const exist = await Service.getByField(Neighbourhood, 'name', name);
        if (exist && exist._id.toString() !== id) return res.status(400).json({error: 'Neighbourhood already exists'});

        const updatedNeighbourhood = await Service.update(Neighbourhood, id, req.body);
        if (!updatedNeighbourhood) return res.status(400).json({error: 'There was an error updating the neighbourhood'});

        return res.status(200).json(updatedNeighbourhood);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

// const destroy = async (req, res) => {
//     try {
//         const {id} = req.params;
//
//         const findId = await Service.getOne(Neighbourhood, id);
//         if (!findId) return res.status(404).json({error: 'Neighbourhood not found'});
//
//         await Service.destroy(Neighbourhood, id);
//         return res.status(200).json({message: 'Neighbourhood destroyed'});
//     } catch (e) {
//         return res.status(500).json({error: e.message});
//     }
// }

const softDelete = async (req, res) => {
    try {
        const {id} = req.params;

        const neighbourhood = await Service.getOne(Neighbourhood, id);
        if (!neighbourhood) return res.status(404).json({error: 'Neighbourhood not found'});

        neighbourhood.active = false;
        await neighbourhood.save();

        return res.status(200).json({message: 'Neighbourhood deleted'});
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}


module.exports = {
    create,
    getAll,
    getOne,
    update,
   softDelete
}
