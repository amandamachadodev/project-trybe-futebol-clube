import Teams from '../models/Teams';

export default class TeamService {
  public teams;
  constructor() {
    this.teams = Teams;
  }

  public list = async () => {
    const result = await this.teams.findAll();
    return result;
  };

  public findId = async (id: string) => {
    const result = await this.teams.findByPk(id);
    console.log(result);
    if (!result) {
      return false;
    }
    return result;
  };
}
