import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboardService';

export default class LeaderboardController {
  public leaderboardService;

  constructor() {
    this.leaderboardService = new LeaderboardService();
  }

  public listHome = async (_req: Request, res: Response) => {
    const result = await LeaderboardService.listHome();
    // console.log(result);
    return res.status(200).json(result);
  };

  public listAway = async (_req: Request, res: Response) => {
    const result = await LeaderboardService.listAway();
    // console.log(result);
    return res.status(200).json(result);
  };

  public listAll = async (_req: Request, res: Response) => {
    const result = await LeaderboardService.orderAll();
    // console.log(result);
    return res.status(200).json(result);
  };
}
