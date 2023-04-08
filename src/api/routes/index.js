import { Router } from 'express';
import userController from './admin/user/user';
import ticketController from './admin/ticket/ticket';

const router = new Router()

router.use('/v1/admin/user', userController);
router.use('/v1/admin/ticket', ticketController);

export default router;
