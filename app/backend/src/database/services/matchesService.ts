import Matches from '../models/Matches';
import Teams from '../models/Teams';
import { IMatches } from '../interfaces';

export default class MatchesService {
  public static list = async (): Promise<Matches[]> => {
    const result: Matches[] = await Matches.findAll({ include: [
      { model: Teams, as: 'teamHome', attributes: { exclude: ['id'] } },
      { model: Teams, as: 'teamAway', attributes: { exclude: ['id'] } }] });
    return result;
  };

  public static saveMatches = async (matches: IMatches): Promise<boolean | Matches> => {
    const team = await Matches.findByPk(matches.awayTeam)
      && await Matches.findByPk(matches.homeTeam);

    if (!team) {
      return false;
    }
    const createdMatches = await Matches.create(matches);
    return createdMatches;
  };

  public static updateMatches = async (id: string) => {
    const [matchesUpdate] = await Matches.update({ inProgress: false }, {
      where: { id } });
    return matchesUpdate;
  };

  public static updateGoals = async (id: string, homeTeamGoals: string, awayTeamGoals: string) => {
    const [updateGoals] = await Matches.update({ homeTeamGoals, awayTeamGoals }, {
      where: { id } });
    return updateGoals;
  };
}
