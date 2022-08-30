import { Router } from 'express';
import LoginController from '../controllers/loginController';

const loginController = new LoginController();

const router = Router();

router.post('/login', loginController.login);

router.get('/login/validate', loginController.validateToken);

export default router;
