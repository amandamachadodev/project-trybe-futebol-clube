import { Request, Response } from 'express';
import TeamService from '../services/teamService';

export default class TeamController {
  public teamService;

  constructor() {
    this.teamService = new TeamService();
  }

  public list = async (_req: Request, res: Response) => {
    const teams = await TeamService.list();
    if (!teams) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.status(200).json(teams);
  };

  public findId = async (req: Request, res: Response) => {
    const { id } = req.params;
    const team = await TeamService.findId(id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    return res.status(200).json(team);
  };
}
