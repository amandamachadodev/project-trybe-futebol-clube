import { Ileaderboard } from '../interfaces';
import Matches from '../models/Matches';
import Teams from '../models/Teams';

export interface ITeams {
  awayMatches: any;
  id: number,
  teamName: string,
  homeMatches: [
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
  static amountPoints = (homeMatches: IMatche[], where: string) => {
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

  static amountVictories = (homeMatches: IMatche, where: string) => {
    let victories = 0;
    const teams = where === 'home' ? 'homeTeamGoals' : 'awayTeamGoals';
    const team = where === 'home' ? 'awayTeamGoals' : 'homeTeamGoals';
    homeMatches.forEach((element: any) => {
      if (element[teams] > element[team]) {
        victories += 1;
      }
    });
    return victories;
  };

  static amountDraws = (homeMatches: IMatche, where: string) => {
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

  static amountLosses = (homeMatches: IMatche, where: string) => {
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

  static amountGoalsFavor = (homeMatches: IMatche, where: string) => {
    let goals = 0;
    const teams = where === 'home' ? 'homeTeamGoals' : 'awayTeamGoals';
    homeMatches.forEach((element: any) => {
      goals += element[teams];
    });
    return goals;
  };

  static amountGoalsOwn = (homeMatches: IMatche, where: string) => {
    let goals = 0;
    const team = where === 'home' ? 'awayTeamGoals' : 'homeTeamGoals';
    homeMatches.forEach((element: any) => {
      goals += element[team];
    });
    return goals;
  };

  static order = (teamsHome: Ileaderboard[]) =>
    teamsHome.sort((c, d) => d.totalPoints - c.totalPoints
    || d.totalVictories - c.totalVictories
    || d.goalsBalance - c.goalsBalance
    || d.goalsFavor - c.goalsFavor
    || c.goalsOwn - d.goalsOwn);

  static leaderboard = (teams: Teams[], where: string) => {
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

  public static listHome = async () => {
    const result = await Teams.findAll({ include: [{ model: Matches,
      as: 'homeMatches',
      where: { inProgress: false } }] });

    return this.leaderboard(result, 'home');
  };

  public static listAway = async () => {
    const result = await Teams.findAll({ include: [{ model: Matches,
      as: 'awayMatches',
      where: { inProgress: false } }] });

    return this.leaderboard(result, 'away');
  };

  public static listAll = async () => {
    const home = await this.listHome();
    const away = await this.listAway();
    return home.map((homeT) => away.reduce((acc, awayT) => {
      if (homeT.name === awayT.name) {
        acc.name = homeT.name;
        acc.totalPoints = awayT.totalPoints + homeT.totalPoints;
        acc.totalGames = awayT.totalGames + homeT.totalGames;
        acc.totalVictories = awayT.totalVictories + homeT.totalVictories;
        acc.totalDraws = awayT.totalDraws + homeT.totalDraws;
        acc.totalLosses = awayT.totalLosses + homeT.totalLosses;
        acc.goalsFavor = awayT.goalsFavor + homeT.goalsFavor;
        acc.goalsOwn = awayT.goalsOwn + homeT.goalsOwn;
        acc.goalsBalance = acc.goalsFavor - acc.goalsOwn;
        acc.efficiency = ((acc.totalPoints
        / (acc.totalGames * 3)) * 100).toFixed(2);
      }
      return acc;
    }, {} as Ileaderboard));
  };

  static orderAll = async () => {
    const allTeams = await this.listAll();
    return this.order(allTeams);
  };
}
