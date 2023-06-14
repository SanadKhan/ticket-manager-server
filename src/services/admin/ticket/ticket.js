import { fileService, userService } from '../..';
import { Ticket } from '../../../models';
const io = require("../../../loaders/socket").getIO();

export const create = async (values) => {
    try {
        const ticket = new Ticket(values);
        await ticket.save();
        // emailService.sendWelcomeEmail(ticket.email, ticket.name, values.password);
        const { user } = await userService.read(ticket.assigned_to);
        console.log("user from created tickets", user.name, user.socketId);
        io.to(user.socketId).emit("message","New Ticket has been assigned!")
        return {
            status: 201, msgText: 'Created Successfully! ',
            success: true, ticket
        }
    } catch (error) {
        throw error;
    }
};

export const readAll = async ({ page, perPage, filters, userId }) => {
    try {
        let whereClause;
        if (filters === 'created') {
            whereClause = { owner: userId }
        } else if (filters === 'assigned') {
            whereClause = { assigned_to: userId }
        } else {
            whereClause = {}
        }
        const ticket = await Ticket.find(whereClause)
            .sort({ _id: -1 }).skip(((perPage * page) - perPage))
            .limit(perPage);
        if (!ticket.length > 0) {
            return { status: 404, msgText: "Ticket does not exists!", success: false }
        }
        const ticketRecords = await Ticket.find(whereClause).count();
        return { status: 200, success: true, ticketRecords, ticket }
    } catch (error) {
        throw error;
    }
};

export const read = async (id) => {
    try {
        const ticket = await Ticket.findById(id)
        if (!ticket) {
            return { status: 404, msgText: "Ticket does not exists!", success: false }
        }
        return { status: 200, success: true, ticket }
    } catch (error) {
        throw error;
    }
};

export const update = async (id, values) => {
    try {
        const ticket = await Ticket.findById(id);
        const { assigned_to } = ticket; 
        // console.log("ticket vlaues before", ticket);
        if (!ticket) {
            return { status: 404, msgText: "Ticket does not exists!", success: false }
        }
        if (values.ticket_files) {
            ticket.ticket_files.push.apply(ticket.ticket_files, values.ticket_files)
        }
        if (values.deleted_img) {
            for (const deleteImg of values.deleted_img) {
                const matchedIndex = ticket.ticket_files.findIndex(item => item.fileId === deleteImg)
                if (matchedIndex !== -1) {
                    ticket.ticket_files.splice(matchedIndex, 1);
                }
            }
            await fileService.deleteFiles(values.deleted_img);
        }
        ticket.title = values.title;
        ticket.description = values.description;
        ticket.owner = values.owner;
        ticket.assigned_to = values.assigned_to;
        ticket.status = values.status;
        await ticket.save();
        // console.log("ticket values after update", ticket);
        // console.log("assigned to ", assigned_to);
        // console.log("values asigned from payload to ", values.assigned_to);
        // console.log("assigned to ", assigned_to.toString());
        // if (assigned_to.toString() !== values.assigned_to) {
        //     const { user } = await userService.read(ticket.assigned_to);
        //     console.log("user update tickets", user.name, user.socketId);
        //     io.to(user.socketId).emit("message","New Ticket has been assigned!")
        // }
        return { status: 200, msgText: 'Updated Successfully! ', success: true, ticket }
    } catch (error) {
        throw error;
    }
};
export const updateTicketStatus = async (id, values) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(id, values, { returnDocument: true });
        if (!ticket) {
            return { status: 404, msgText: "Ticket does not exists!", success: false }
        }

        return { status: 200, msgText: 'Updated Successfully! ', success: true, ticket }
    } catch (error) {
        throw error;
    }
};

export const remove = async (id) => {
    try {
        let deleted_img = []
        const ticket = await Ticket.findByIdAndDelete(id)
        if (!ticket) {
            return { status: 404, msgText: "Ticket does not exists!", success: false }
        }
        if (ticket.ticket_files.length) {
            ticket.ticket_files.forEach(({ fileId }) => deleted_img.push(fileId));
            await fileService.deleteFiles(deleted_img);
        }

        return { status: 200, msgText: 'Deleted Successfully!', success: true, ticket }
    } catch (error) {
        throw error;
    }
};

