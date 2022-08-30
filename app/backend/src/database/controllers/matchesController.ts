import { Request, Response } from 'express';
import LoginService from '../services/loginService';
import MatchesService from '../services/matchesService';

export default class MatchesController {
  public matchesService;
  public loginService;

  constructor() {
    this.matchesService = new MatchesService();
    this.loginService = new LoginService();
  }

  public list = async (_req: Request, res: Response) => {
    const matches = await this.matchesService.list();
    console.log(matches);
    if (!matches) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.status(200).json(matches);
  };

  public saveMatches = async (req: Request, res: Response) => {
    const matches = await this.matchesService.saveMatches(req.body);
    console.log(matches);
    return res.status(201).json(matches);
  };
}
