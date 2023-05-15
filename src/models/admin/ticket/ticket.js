import { model, Schema } from "mongoose";

const ticketSchema = Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    description: {
        type: String,
        required: true,
        minlength: 3
    }, 
    status: {
        type: String,
        default: "Pending"
    }, 
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    assigned_to: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    ticket_files: [{
        _id: false,
        fileId: String,
        url: String
    }],
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true})

const Ticket = model('Ticket', ticketSchema);

export default Ticket;