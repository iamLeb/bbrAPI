const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Service = require('../helpers/Services');
const {findOneAndUpdate} = require('../models/Blog');
const CheckAuthentication = require('../middlewares/CheckAuthentication');
const validator = require('validator');


const createToken = (_id, res) => {
    // creating the token
    const token = jwt.sign({_id}, process.env.SECRET, {expiresIn: '30d'});

    // send the token to client cookie
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
    });

    return true;
}

const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const user = await User.register(name, email, password);

        // create token
        const token = createToken(user._id, res);
        if (token) {
            return res.status(200).json(user);
        }
    } catch (e) {
        return res.status(400).json({error: e.message});
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.login(email, password);

        // create token
        const token = createToken(user._id, res);
        if (token) {
            return res.status(200).json(user);
        }

    } catch (e) {
        return res.status(400).json({error: e.message})
    }
}

const checkAuth = (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (e) {
        return res.status(400).json({error: e.message});
    }
}

const reset = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await Service.getOne(User, id)
        const {password, newPassword} = req.body;
        const match = await bcrypt.compare(password, user.password);

        if (!match) return res.status(400).json({error: 'The current password you entered is incorrect. Please try again.'});

        if (!newPassword) return res.status(400).json({error: 'New password is required'});

        if (newPassword.length < 6) {
            return res.status(400).json({error:'Password must be at least 6 characters long'});
        }
        // validate password strength
        if (!validator.isStrongPassword(newPassword)) {
            return res.status(400).json({error:'Password is not strong enough, please try again'});
        }

        const hash = await bcrypt.hash(newPassword, 10);

        const updated = await Service.update(User, id, {password: hash})
        if (!updated) {
            return res.status(400).json({error: 'There was an error updating the password'});
        }

        return res.status(200).json(updated);

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
    logout,
    reset
};