const Service = require('../helpers/Services');
const Comment = require('../models/Comment');

const create = async (req,res) => {
    try{
        const {name, message} = req.body
        if(!message) return res.status(400).json({error: 'message is required'});

        const comment = await Service.create(Comment, req.body);
        if (!comment) return res.status(400).json({error: 'There was an error creating the Comment'});
        return res.status(201).json(comment);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Service.getOne(Comment, id);
        if (!comment) return res.status(404).send({error: 'Comment not found'});

        return res.status(200).json(comment);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const getAll = async (req,res) => {
    try{
        const comments = await Service.getAll(Comment);
        return res.status(200).json(comments);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;

        const findId = await Service.getOne(Comment, id);
        if(!findId) return res.status(404).json({error: 'comment not found'});

        const { name, message } = req.body;
        if (!name ) findId.message = message;
        if(!message) findId.name = name;
        

        const updatedMessage = await Service.update(Comment, id, req.body);
        if (!updatedMessage) return res.status(400).json({error: 'There was an error updating the comment'});

        return res.status(200).json(updatedMessage);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const findId = await Service.getOne(Comment, id);
        if(!findId) return res.status(404).json({error: 'Comment not found'});

        await Service.destroy(Comment, id);
        return res.status(200).json({message: 'Comment destroyed'});
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