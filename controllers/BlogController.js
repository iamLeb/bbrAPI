const Service = require('../helpers/Services');
const Blog = require('../models/Blog');

const create = async (req, res) => {
    try {
        const { title,image,content,category } = req.body;
        if (!title || !image || !content || !category) return res.status(400).json({error: 'All fields required'});

        const blog = await Service.create(Blog, req.body);
        if (!blog) return res.status(400).json({error: 'There was an error creating the Blog'});

        return res.status(200).json(blog);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const getAll = async (req, res) => {
    try {
        const blogs = await Service.getAll(Blog);
        return res.status(200).json(blogs);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const getOne = async (req,res) => {
    try{
        const { id } = req.params;
        const blog = await Service.getOne(Blog, id);
        if (!blog) return res.status(404).send({error: 'Post not found'});

        return res.status(200).json(blog);
    } catch (e){
        return res.status(500).json({error: e.message});
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;

        const findId = await Service.getOne(Blog, id);
        if(!findId) return res.status(404).json({error: 'comment not found'}); 

        const {title, image, content} = req.body;

        const update = await Service.update(Blog, id, req.body);
        if (!update) return res.status(400).json({error:'There was an error updating the blog'});
        

        return res.status(200).json(update);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const destroy = async (req,res) => {
    try{
        const { id } = req.params;
        const findId = await Service.getOne(Blog,id);
        if(!findId) return res.status(404).json({error:'Post not found'});

        await Service.destroy(Blog,id);
        return res.status(200).json({message: 'Blog destroyed'});

    } catch (e){
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