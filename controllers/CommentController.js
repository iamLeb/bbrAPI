const Service = require('../helpers/Services');
const Comment = require('../models/Comment');

const create = async (req,res) => {
    try{
        const {name, message} = req.body
        if(!message) return res.status(400).json({error: 'message is required'});

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