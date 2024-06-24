const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createToken = (_id, res) => {
    // creating the token
    const token = jwt.sign({ _id }, process.env.SECRET, { expiresIn: '30d' });

    // send the token to client cookie
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
    });

    return true;
}

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.register(name, email, password);

        res.status(200).send(user);
    } catch (e) {
        return res.status(400).json({error: e.message});
    }
}

const login = async (req, res) => {
    try{
        const{ email, password } = req.body;
        const user = await User.login(email, password);

        // create token
        const token = createToken(user._id, res);
        if (token) {
            res.status(200).json('You will be remembered');
        }

    }catch(e){
        return res.status(400).json({error: e.message})
    }
}

const checkAuth = (req, res) => {
    try {
        return res.status(200).json(req.user.name);
    } catch (e) {
        return res.status(400).json({error: e.message});
    }
}

const logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json('You are logged out');
    } catch (e) {
        res.status(400).json({error: e.message});
    }
}

module.exports = {
    register,
    login,
    checkAuth,
    logout
};