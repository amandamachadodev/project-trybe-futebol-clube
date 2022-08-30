import { Request, Response } from 'express';
import MatchesService from '../services/matchesService';

export default class MatchesController {
  public matchesService;

  constructor() {
    this.matchesService = new MatchesService();
  }

  public list = async (_req: Request, res: Response) => {
    const matches = await this.matchesService.list();
    console.log(matches);
    if (!matches) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.status(200).json(matches);
  };
}
