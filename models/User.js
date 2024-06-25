const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    type: {
        type: String,
        enum: ['supers', 'admins', 'agents', 'users'],
        default: 'users'
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    }
}, { timestamps: true });

// Static method to register a new user
UserSchema.statics.register = async function(name, email, password) {
    try {
        // Validate the input fields
        if (!name || !email || !password) {
            throw new Error('All fields are required');
        }
        if (!validator.isEmail(email)) {
            throw new Error('You have entered an invalid email');
        }
        // validate password length
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        // validate password strength
        if (!validator.isStrongPassword(password)) {
            throw new Error('Password is not strong enough, please try again');
        }
        // if email exists
        const exist = await this.findOne({email});
        if (exist) {
            throw new Error('Account already exists');
        }

        // hash password
        const hash = await bcrypt.hash(password, 10);

        // create the user
        return await this.create({ name, email, password: hash});

    } catch (e) {
        throw e;
    }
};

UserSchema.statics.login = async function(email, password) {
 try{
     if(!email || !password) throw new Error('All fields are required');

     const user = await this.findOne({email});
     if(!user) throw new Error('User does not exist');

     const match = await bcrypt.compare(password, user.password);

     if(!match) throw new Error('User does not exist');

     return user;
 }catch(e){
     throw e;
 }
}

const User = mongoose.model("User", UserSchema);

module.exports = User;
