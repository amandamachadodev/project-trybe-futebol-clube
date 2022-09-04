import { Ileaderboard } from '../interfaces';
import Matches from '../models/Matches';
import Teams from '../models/Teams';

// "id": 16,
//     "teamName": "São Paulo",
//     "homeMatches": [
//       {
//         "id": 1,
//         "homeTeam": 16,
//         "homeTeamGoals": 1,
//         "awayTeam": 8,
//         "awayTeamGoals": 1,
//         "inProgress": 0
//       },
//       {
//         "id": 28,
//         "homeTeam": 16,
//         "homeTeamGoals": 3,
//         "awayTeam": 7,
//         "awayTeamGoals": 0,
//         "inProgress": 0
//       }

// {
//   "name": "Palmeiras",
//   "totalPoints": 13,
//   "totalGames": 5,
//   "totalVictories": 4,
//   "totalDraws": 1,
//   "totalLosses": 0,
//   "goalsFavor": 17,
//   "goalsOwn": 5,
//   "goalsBalance": 12,
//   "efficiency": 86.67
// }
export interface ITeams {
  awayMatches: any;
  id: number,
  teamName: string,
  homeMatches?: [
    {
      id: number,
      homeTeam: number,
      homeTeamGoals: number,
      awayTeam: number,
      awayTeamGoals: number,
      inProgress: number
    },
    {
      id: number,
      homeTeam: number,
      homeTeamGoals: number,
      awayTeam: number,
      awayTeamGoals: number,
      inProgress: boolean
    },
  ]
}

export interface IMatche {
  forEach(arg0: (element: []) => void): unknown;
  homeMatches: [],
  awayMatches: [],
}

export default class leaderboard {
  public teams;
  public matches;

  constructor() {
    this.matches = Matches;
    this.teams = Teams;
  }

  amountPoints = (homeMatches: IMatche[], where: string) => {
    let points = 0;
    const teams = where === 'home' ? 'homeTeamGoals' : 'awayTeamGoals';
    const team = where === 'home' ? 'awayTeamGoals' : 'homeTeamGoals';
    homeMatches.forEach((element: any) => {
      if (element[teams] > element[team]) {
        points += 3;
      } if (element[teams] === element[team]) {
        points += 1;
      }
    });
    return points;
  };

  amountVictories = (homeMatches: IMatche, where: string) => {
    let victories = 0;
    const teams = where === 'home' ? 'homeTeamGoals' : 'awayTeamGoals';
    const team = where === 'home' ? 'awayTeamGoals' : 'homeTeamGoals';
    homeMatches.forEach((element: any) => {
      if (element[teams] > element[team]) {
        victories += 1;
        console.log(element[teams] > element[team]);
      }
    });
    return victories;
  };

  amountDraws = (homeMatches: IMatche, where: string) => {
    let draws = 0;
    const teams = where === 'home' ? 'homeTeamGoals' : 'awayTeamGoals';
    const team = where === 'home' ? 'awayTeamGoals' : 'homeTeamGoals';
    homeMatches.forEach((element: any) => {
      if (element[teams] === element[team]) {
        draws += 1;
      }
    });
    return draws;
  };

  amountLosses = (homeMatches: IMatche, where: string) => {
    let losses = 0;
    const teams = where === 'home' ? 'homeTeamGoals' : 'awayTeamGoals';
    const team = where === 'home' ? 'awayTeamGoals' : 'homeTeamGoals';
    homeMatches.forEach((element: any) => {
      if (element[teams] < element[team]) {
        losses += 1;
      }
    });
    return losses;
  };

  amountGoalsFavor = (homeMatches: IMatche, where: string) => {
    let goals = 0;
    const teams = where === 'home' ? 'homeTeamGoals' : 'awayTeamGoals';
    homeMatches.forEach((element: any) => {
      goals += element[teams];
    });
    return goals;
  };

  amountGoalsOwn = (homeMatches: IMatche, where: string) => {
    let goals = 0;
    const team = where === 'home' ? 'awayTeamGoals' : 'homeTeamGoals';
    homeMatches.forEach((element: any) => {
      goals += element[team];
    });
    return goals;
  };

  order = (teamsHome: Ileaderboard[]) =>
    teamsHome.sort((c, d) => d.totalPoints - c.totalPoints
    || d.totalVictories - c.totalVictories
    || d.goalsBalance - c.goalsBalance
    || d.goalsFavor - c.goalsFavor
    || c.goalsOwn - d.goalsOwn);

  leaderboard = (teams: Teams[], where: string) => {
    const result = teams.map((element: any) => {
      const team = where === 'home' ? element.homeMatches : element.awayMatches;
      return ({
        name: element.teamName,
        totalPoints: this.amountPoints(team, where),
        totalGames: team.length,
        totalVictories: this.amountVictories(team, where),
        totalDraws: this.amountDraws(team, where),
        totalLosses: this.amountLosses(team, where),
        goalsFavor: this.amountGoalsFavor(team, where),
        goalsOwn: this.amountGoalsOwn(team, where),
        goalsBalance: this.amountGoalsFavor(team, where) - this.amountGoalsOwn(team, where),
        efficiency: ((this.amountPoints(team, where)
        / (team.length * 3)) * 100).toFixed(2) }
      );
    });
    return this.order(result);
  };

  public listHome = async () => {
    const result = await this.teams.findAll({ include: [{ model: Matches,
      as: 'homeMatches',
      where: { inProgress: false } }] });

    return this.leaderboard(result, 'home');
  };

  public listAway = async () => {
    const result = await this.teams.findAll({ include: [{ model: Matches,
      as: 'awayMatches',
      where: { inProgress: false } }] });

    return this.leaderboard(result, 'away');
  };
}
