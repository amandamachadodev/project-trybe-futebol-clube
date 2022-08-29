import * as dotenv from 'dotenv';
import Teams from '../models/Teams';

dotenv.config();

export default class TeamService {
  public teams;
  constructor() {
    this.teams = Teams;
  }

  public list = async () => {
    const result = await this.teams.findAll();
    return result;
  };
}
