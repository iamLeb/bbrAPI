const Service = require('../helpers/Services');
const Contact = require('../models/Contact');

const create = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !phone || !message) return res.status(400).json({error: 'All fields are required'});

        const contact = await Service.create(Contact, req.body);
        if (!contact) return res.status(400).json({error: 'An error occurred'});

        return res.status(201).json(contact);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const getAll = async (req, res) => {
    try {
        const contacts = await Service.getAll(Contact);
        return res.status(200).json(contacts);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Service.getOne(Contact, id);
        if (!contact) return res.status(404).json({error: 'Contact not found'});

        return res.status(200).json(contact);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const findId = await Service.getOne(Contact, id);
        if(!findId) return res.status(404).json({error: 'Contact not found'});

        await Service.destroy(Contact, id);
        return res.status(200).json({message: 'Contact destroyed'});
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

module.exports = {
    create,
    getAll,
    getOne,
    destroy
}
