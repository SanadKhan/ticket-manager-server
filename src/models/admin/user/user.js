import { Schema, model } from 'mongoose';
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import config from '../../../config/index';

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    active : {
        type: Boolean,
        default : true
    }
},{ 
    timestamps: true
});

// Necessary Data
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};

//generateAuth token 
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = sign({_id:user._id.toString()}, config.JWT);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

//Hash Password
userSchema.pre('save', async function (next){
    const user = this;
    if(user.isModified('password')) {
        user.password = await hash(user.password,8);
    }
    next();
});

const User = model('User', userSchema);
export default User;