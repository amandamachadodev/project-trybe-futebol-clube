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
    const { homeTeam, awayTeam } = req.body;
    if (homeTeam === awayTeam) {
      return res.status(401)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }
    const matches = await this.matchesService.saveMatches(req.body);
    return res.status(201).json(matches);
  };

  public updateMatches = async (req: Request, res: Response) => {
    await this.matchesService.updateMatches(req.params.id);
    return res.status(200).json({ message: 'Finished' });
  };
}
