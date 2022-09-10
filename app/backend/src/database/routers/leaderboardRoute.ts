import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboardController';

const leaderboardController = new LeaderboardController();

const router = Router();

router.get('/leaderboard/home', leaderboardController.listHome);

router.get('/leaderboard/away', leaderboardController.listAway);

router.get('/leaderboard', leaderboardController.listAll);

export default router;
