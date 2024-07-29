const mongoose = require("mongoose");

const create = async (model, data) => {
    try {
        return await model.create(data);
    } catch (e) {
        throw new Error(`Error creating document: ${e.message}`);
    }
}

const getAll = async model => {
    try {
        return await model.find();
    } catch (e) {
        throw new Error(`Error fetching documents: ${e.message}`);
    }
}

const getOne = async (model, id) => {
    try {
        checkId(id);
        return await model.findById(id);
    } catch (e) {
        throw new Error(`Error fetching document by ID: ${e.message}`);
    }
}

const getByField = async (model, field, value) => {
    try {
        return await model.findOne({[field]: value});
    } catch (e) {
        throw new Error(`Error fetching document by field: ${e.message}`);
    }
}

const findAll = async (Model, field, value) => {
    try {
        return await Model.find({[field]: value});
    } catch (e) {
        throw new Error(`Error fetching document by field: ${e.message}`);
    }
};

const update = async (model, id, data) => {
    try {
        checkId(id);
        return await model.findByIdAndUpdate(id, data, {new: true});
    } catch (e) {
        throw new Error(`Error updating document: ${e.message}`);
    }
}

const destroy = async (model, id) => {
    try {
        checkId(id);
        return await model.findByIdAndDelete(id);
    } catch (e) {
        throw new Error(`Error deleting document: ${e.message}`);
    }
}

const checkId = id => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid ID format');
        }
    } catch (e) {
        throw e;
    }
}

module.exports = {
    create,
    getAll,
    getOne,
    getByField,
    update,
    destroy,
    checkId,
    findAll,
}
