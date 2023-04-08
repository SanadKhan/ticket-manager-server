import { Router } from 'express';
import { userService } from '../../../../services';
import { formatFormError } from '../../../../utils/helper';
import Joi from 'joi';
import logger from "../../../../loaders/logger";
const router = new Router();
import { auth, fileUploads, requestValidator } from '../../../middlewares';

router.get('', auth, async (req,res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const { status, ...data} = await userService.read({ page, perPage })
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_USER-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const ticketValidation = Joi.object({
    title: Joi.string().min(3).required().trim(),
    descpription: Joi.string().min(3).required().trim(),
    status: Joi.string().valid("Completed", "Pending").required(),
    owner: Joi.string().required(),
    assignedto: Joi.string().required(),
    id: Joi.string()
});

router.post('/create', requestValidator(ticketValidation), async (req, res) => {
    try {
        const { status, ...data} = await userService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_USER-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await userService.read({whereClause:{_id}});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_USER-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(ticketValidation), async(req, res) => {
    try {
        const { status, ...data} = await userService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_USER-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, async (req, res) => {
    try {
        const { status, ...data} = await userService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;