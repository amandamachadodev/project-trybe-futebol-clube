import { Router } from 'express';
import TeamController from '../controllers/teamController';

const teamController = new TeamController();

const router = Router();

router.get('/teams', teamController.list);

router.get('/teams/:id', teamController.findId);

export default router;
