import { ITeams } from '../interfaces';
import Teams from '../models/Teams';

export default class TeamService {
  public static list = async (): Promise<ITeams[]> => {
    const result = await Teams.findAll();
    return result;
  };

  public static findId = async (id: string) => {
    const result = await Teams.findByPk(id);
    console.log(result);
    if (!result) {
      return false;
    }
    return result;
  };
}
