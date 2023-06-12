import { Router } from 'express';
import { ticketService, fileService } from '../../../../services';
import { formatFormError } from '../../../../utils/helper';
import Joi from 'joi';
import logger from "../../../../loaders/logger";
const router = new Router();
import { auth, fileUploads, requestValidator } from '../../../middlewares';

const readAllTicketValidation = Joi.object({
    ticketType: Joi.string().valid('all', 'assigned', 'created').required(),
    p: Joi.number(),
    r: Joi.number()
})
router.post('', auth, requestValidator(readAllTicketValidation), async (req,res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt(req.query.r) || 10
        const filters = req.values.ticketType
        const userId = req.user._id
        const { status, ...data} = await ticketService.readAll({ page, perPage, filters, userId })
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_TICKET-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const ticketValidation = Joi.object({
    title: Joi.string().min(3).required().trim(),
    description: Joi.string().min(3).required().trim(),
    status: Joi.string().valid("Completed", "Pending").required(),
    owner: Joi.string().required(),
    assigned_to: Joi.string().required(),
    ticket_files: Joi.array().items({
        fileId: Joi.string().required(),
        url: Joi.string().required()
    }),
    deleted_img: Joi.array(),
    id: Joi.string()
});

router.post('/create', auth, fileUploads('ticket_files'), requestValidator(ticketValidation), async (req, res) => {
    try {
        if (req.files.length) {
            const files = await fileService.uploadFiles(req.files);
            req.values.ticket_files = files
        }
        const { status, ...data} = await ticketService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_TICKET-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/uploadFiles', auth, fileUploads('files'), async (req, res) => {
    try {
        console.log("files", req.files)
        if (!req.files){
            throw { status: 400, success: false, msgText: "file is required" }
        }
        const { status, ...data} = await fileService.uploadFiles(req.files);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_TICKET-UPLOADFILES-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const deleteicketFilesValidation = Joi.object({
    fileIds: Joi.array().required()
});

router.post('/deleteFiles', auth, requestValidator(deleteicketFilesValidation), async (req, res) => {
    try {
        const data = await fileService.deleteFiles(req.values.fileIds);
        res.send(data);
    } catch (error) {
        console.log("error", error);
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const { status, ...data} = await ticketService.read(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_TICKET-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, fileUploads('ticket_files'), requestValidator(ticketValidation), async(req, res) => {
    try {
        if (req.files.length) {
            const files = await fileService.uploadFiles(req.files);
            req.values.ticket_files = files
        }
        const { status, ...data} = await ticketService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_TICKET-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const ticketStatusValidation = Joi.object({
    status: Joi.string().valid('Completed', 'Pending').required(),
    id: Joi.string()
});

router.post('/updateTicketStatus/:id', auth, requestValidator(ticketStatusValidation), async(req, res) => {
    try {
        const { status, ...data} = await ticketService.updateTicketStatus(req.params.id, req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_TICKET-STATUSUPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { status, ...data} = await ticketService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!' })
        console.log("DELETE_API_ERROR", error);
    }
});

export default router;