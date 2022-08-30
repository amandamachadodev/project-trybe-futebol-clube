import { Router } from 'express';
import MatchesController from '../controllers/matchesController';

const matchesController = new MatchesController();

const router = Router();

router.get('/matches', matchesController.list);

export default router;
