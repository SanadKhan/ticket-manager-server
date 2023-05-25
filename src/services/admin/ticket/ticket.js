import { Ticket } from '../../../models';

export const create = async (values) => {
    try {
        const ticket = new Ticket(values);
        await ticket.save();
        // emailService.sendWelcomeEmail(ticket.email, ticket.name, values.password);
        return {
            status: 201, msgText: 'Created Successfully! ',
            success: true, ticket
        }
    } catch (error) {
        throw error;
    }
};

export const readAll = async ({ page, perPage, whereClause = {} }) => {
    try {
        const ticket = await Ticket.find(whereClause)
            .populate([
                { 'path': 'owner', 'select': ['name'] },
                { 'path': 'assigned_to', 'select': ['name'] },
            ])
            .sort({ _id: -1 }).skip(((perPage * page) - perPage))
            .limit(perPage);
        if (!ticket.length > 0) {
            return { status: 404, msgText: "Ticket does not exists!", success: false }
        }
        return { status: 200, success: true, ticket }
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
        console.log("values", values);
        const ticket = await Ticket.findById(id)
            .populate([
                { 'path': 'owner', 'select': ['name'] },
                { 'path': 'assigned_to', 'select': ['name'] },
            ]);
        // const ticket = await Ticket.findByIdAndUpdate(id, values , { returnDocument: true });
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
                    ticket.ticket_files.splice(matchedIndex, 1)
                }
            }
        }
        ticket.title = values.title;
        ticket.description = values.description;
        ticket.owner = values.owner;
        ticket.assinged_to = values.assinged_to;
        ticket.status = values.status;
        await ticket.save();

        return { status: 200, msgText: 'Updated Successfully! ', success: true, ticket }
    } catch (error) {
        throw error;
    }
};

export const remove = async (id) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(id)
        return { status: 200, msgText: 'Deleted Successfully!', success: true, ticket }
    } catch (error) {
        throw error;
    }
};

