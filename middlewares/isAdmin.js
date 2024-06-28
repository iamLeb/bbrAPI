const User = require('../models/User');
const isAdmin = async (req, res, next) => {
    try {
        const isAdmin = User.isAdmin(req.user.id);
        await isAdmin ? next() : res.status(401).json({error: 'Unauthorized User'});
    } catch (e) {
        throw e;
    }
}

module.exports = isAdmin;