import { Router } from 'express';
import MatchesController from '../controllers/matchesController';
import validateToken from '../middlewares/auth';

const matchesController = new MatchesController();

const router = Router();

router.get('/matches', matchesController.list);

router.post('/matches', validateToken, matchesController.saveMatches);

export default router;
