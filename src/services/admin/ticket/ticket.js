import { Ticket } from '../../../models';

export const create = async(values) => {
    try {
        const ticket = new Ticket(values);
        await ticket.save();
        // emailService.sendWelcomeEmail(ticket.email, ticket.name, values.password);
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, ticket }
    } catch (error) {
        throw error;
    }
};

export const read = async({page, perPage, whereClause={}}) => {
    try {
        const ticket = await Ticket.find(whereClause)
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        if(!ticket.length > 0) {
            return { status: 404 , msgText: "Ticket does not exists!" ,success: false }
        }
        return { status: 200, success: true, ticket}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(id, values);
        if(!ticket) {
            return { status: 404 , msgText: "Ticket does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await Ticket.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};

