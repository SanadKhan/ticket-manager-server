import { Router } from 'express';
import userController from './admin/user/user';

const router = new Router()

router.use('/v1/admin/user', userController);

export default router;
