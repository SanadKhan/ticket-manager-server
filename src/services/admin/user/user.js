import { User } from '../../../models';
import bcrypt from 'bcryptjs';
import { emailService, userSocketService } from '../..';
import config from '../../../config';
import { sign } from 'jsonwebtoken';
const io = require("../../../loaders/socket").getIO();

export const create = async(values) => {
    try {
        const user = new User(values);
        const emailExists = await User.findOne({ email: user.email});
        if(emailExists){
            return { status: 400 , msgText: 'Email already taken',success: false}
        }
        await user.save();
        // emailService.sendWelcomeEmail(user.email, user.name, values.password);
        const token = await user.generateAuthToken();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, user, token }
    } catch (error) {
        throw error;
    }
};

export const login = async(values) => {
    try {
        const user = await User.findOne({email: values.email})
        // .populate({ path: 'role_id', select: ['role_name']});
        if(!user) {
            return { status: 401 , msgText: "Wrong credentials, unable to login!" ,success: false }
        }
        const isMatch = await bcrypt.compare(values.password, user.password);
        if(!isMatch){
            return { status: 401 , msgText: "Wrong credentials, unable to login!" ,success: false }
        }
        io.on('connection', (socket) => {
            console.log("new websokcet connected! from login service", user.name, socket.id);
            // update(user._id, { socketId: socket.id });
        });
        const token = await user.generateAuthToken();  
        return { status: 200, msgText: 'Logged In Successfully! ',
        success: true, user, token}
    } catch (error) {
        throw error;
    }
};

export const readAll = async(whereClause={}) => {
    try {
        const user = await User.find(whereClause).sort( { _id: -1 })
        if(!user.length > 0) {
            return { status: 404 , msgText: "User does not exists!" ,success: false }
        }
        return { status: 200, success: true, user}
    } catch (error) {
        throw error;
    }
};

export const read = async(id) => {
    try {
        const user = await User.findById(id)
        if(!user) {
            return { status: 404 , msgText: "User does not exists!", success: false }
        }
        return { status: 200, success: true, user}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        if(values.password) {
            values.password = await bcrypt.hash(values.password, 8);
        }
        const user = await User.findByIdAndUpdate(id, values);
        if(!user) {
            return { status: 404 , msgText: "User does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const forgotPasswordRequest = async(email) => {
    try {
        const user = await User.findOne({email});
        if(!user) {
            return { status: 401 , msgText: "User mail not found!", success: false }
        }
        const resetToken = sign ({email: user.email}, config.JWT, { expiresIn: '5m'} );
        emailService.sendForgotPasswordEmail(user._id, user.name, email, resetToken);
        return { status: 200, msgText: 'Reset password request sent to your mail!',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await User.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};

