const Service = require('../helpers/Services');
const Category = require('../models/Category');

const create = async (req, res) => {
    try {

        const {name} = req.body;
        if (!name) return res.status(400).json({error: 'Category name is required'});

        const exist = await Service.getByField(Category, 'name', name);
        if (exist) {
            console.log(exist);
            if (!exist.active) {
                exist.active = true;
                await exist.save();
                return res.status(201).json(exist);
            } else {
                return res.status(400).json({error: 'Category already exists'});
            }
        }

        const category = await Service.create(Category, req.body);
        if (!category) return res.status(400).json({error: 'There was an error creating the category'});

        return res.status(201).json(category);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const getAll = async (req, res) => {
    try {
        let categories = await Service.getAll(Category);
        categories = categories.filter(category => category.active);

        return res.status(200).json(categories);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const getOne = async (req, res) => {
    try {
        const {id} = req.params;
        const category = await Service.getOne(Category, id);
        if (!category) return res.status(404).json({error: 'Category not found'});

        return res.status(200).json(category);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

const update = async (req, res) => {
    try {
        const {id} = req.params;

        const findId = await Service.getOne(Category, id);
        if (!findId) return res.status(404).json({error: 'Category not found'});

        const {name} = req.body;
        if (!name) return res.status(400).json({error: 'Category name is required'});

        const exist = await Service.getByField(Category, 'name', name);
        if (exist && exist._id.toString() !== id) return res.status(400).json({error: 'Category already exists'});

        const updatedCategory = await Service.update(Category, id, req.body);
        if (!updatedCategory) return res.status(400).json({error: 'There was an error updating the category'});

        return res.status(200).json(updatedCategory);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

// const destroy = async (req, res) => {
//     try {
//         const { id } = req.params;
//
//         const findId = await Service.getOne(Category, id);
//         if(!findId) return res.status(404).json({error: 'Category not found'});
//
//         await Service.destroy(Category, id);
//         return res.status(200).json({message: 'Category destroyed'});
//     } catch (e) {
//         return res.status(500).json({error: e.message});
//     }
// }

const softDelete = async (req, res) => {
    try {
        const {id} = req.params;

        const category = await Service.getOne(Category, id);
        if (!category) return res.status(404).json({error: 'Category not found'});

        category.active = false;
        await category.save();

        return res.status(200).json({message: 'Category deleted'});
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
