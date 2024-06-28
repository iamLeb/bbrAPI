const Service = require('../helpers/Services');
const Testimonial = require('../models/Testimonial');

const create = async (req, res) => {
    try {
        const { message, name } = req.body;
        if (!name || !message) return res.status(400).json({error: 'All fields are required'});

        const testimonial = await Service.create(Testimonial, req.body);
        if (!testimonial) return res.status(400).json({error: 'There was an error creating the testimonial'});

        return res.status(201).json(testimonial);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const getAll = async (req, res) => {
    try {
        const testimonials = await Service.getAll(Testimonial);
        return res.status(200).json(testimonials);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await Service.getOne(Testimonial, id);
        if (!testimonial) return res.status(404).json({error: 'Testimonial not found'});

        return res.status(200).json(Testimonial);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;

        const findId = await Service.getOne(Testimonial, id);
        if(!findId) return res.status(404).json({error: 'Testimonial not found'});

        const { message, name } = req.body;
        if (!name || !message) return res.status(400).json({error: 'All fields are required'});

        const testimonial = await Service.update(Testimonial, id, req.body);
        if (!testimonial) return res.status(400).json({error: 'There was an error updating the Testimonial'});

        return res.status(200).json(testimonial);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const findId = await Service.getOne(Testimonial, id);
        if(!findId) return res.status(404).json({error: 'Testimonial not found'});

        await Service.destroy(Testimonial, id);
        return res.status(200).json({message: 'Testimonial destroyed'});
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
