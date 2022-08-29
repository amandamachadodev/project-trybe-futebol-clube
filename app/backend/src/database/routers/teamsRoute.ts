import { Router } from 'express';
import TeamController from '../controllers/teamController';

const teamController = new TeamController();

const router = Router();

router.get('/teams', teamController.list);

export default router;
