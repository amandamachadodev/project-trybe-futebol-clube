import Matches from '../models/Matches';
import Teams from '../models/Teams';
import { IMatches } from '../interfaces';

export default class MatchesService {
  public matches;
  constructor() {
    this.matches = Matches;
  }

  public list = async (): Promise<Matches[]> => {
    const result: Matches[] = await this.matches.findAll({ include: [
      { model: Teams, as: 'teamHome', attributes: { exclude: ['id'] } },
      { model: Teams, as: 'teamAway', attributes: { exclude: ['id'] } }] });
    return result;
  };

  public saveMatches = async (matches: IMatches): Promise<boolean | Matches> => {
    const team = await this.matches.findByPk(matches.awayTeam)
      && await this.matches.findByPk(matches.homeTeam);

    if (!team) {
      return false;
    }
    const createdMatches = await this.matches.create(matches);
    return createdMatches;
  };

  public updateMatches = async (id: string) => {
    const [matchesUpdate] = await this.matches.update({ inProgress: false }, {
      where: { id } });
    return matchesUpdate;
  };

  public updateGoals = async (id: string, homeTeamGoals: string, awayTeamGoals: string) => {
    const [updateGoals] = await this.matches.update({ homeTeamGoals, awayTeamGoals }, {
      where: { id } });
    return updateGoals;
  };
}
