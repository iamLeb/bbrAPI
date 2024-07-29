const jwt = require("jsonwebtoken");
const User = require("../models/User");

const CheckAuthentication = async (req, res, next) => {
    try {
        // verify token
        const token= req.cookies.token;

        if (!token) {
            return res.status(401).json("No token provided");
        }

        // very the token
        const matches = jwt.verify(token, process.env.SECRET);
        if (!matches) {
            return res.status(401).json("Invalid token");
        }

        req.user = await User.findById(matches._id);

        next();
    } catch (e) {
        throw e;
    }
}

module.exports = CheckAuthentication;