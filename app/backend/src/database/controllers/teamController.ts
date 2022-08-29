import { Request, Response } from 'express';
import TeamService from '../services/teamService';

export default class TeamController {
  public teamService;

  constructor() {
    this.teamService = new TeamService();
  }

  public list = async (_req: Request, res: Response) => {
    const teams = await this.teamService.list();
    if (!teams) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.status(200).json(teams);
  };
}
