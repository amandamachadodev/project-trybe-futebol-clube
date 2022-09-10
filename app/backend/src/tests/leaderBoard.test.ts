import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as sinon from 'sinon';
import { app } from '../app';
import Matches from '../database/models/Matches';
import leaderboard from '../database/services/leaderboardService';
const { expect } = chai;

chai.use(chaiHttp);

const leaderboardMock = {
  name: "Palmeiras",
  totalPoints: 13,
  totalGames: 5,
  totalVictories: 4,
  totalDraws: 1,
  totalLosses: 0,
  goalsFavor: 17,
  goalsOwn: 5,
  goalsBalance: 12,
  efficiency: "86.67"
}

describe('LeaderBoard', () => {
  describe('listHome', () => {
    beforeEach(() => {
      sinon.stub(leaderboard, 'listHome').resolves([leaderboardMock]);
    })
    afterEach(() => {
      sinon.restore();
    })

    it('return status 200', async () => {
      const response = await chai.request(app)
        .get('/leaderboard/home');

      expect(response.status).to.equal(200);
    })

    it('should return leaderboard home', async () => {
      const response = await chai.request(app)
        .get('/leaderboard/home')

      expect(response.body).to.deep.equal([leaderboardMock]);
    })

    it('should return array', async () => {
      const response = await chai.request(app)
        .get('/leaderboard/home')

      expect(typeof response.body).to.equal('object');
    })
  })

  describe('listAway', () => {
    beforeEach(() => {
      sinon.stub(leaderboard, 'listAway').resolves([leaderboardMock]);
    })
    afterEach(() => {
      sinon.restore();
    })

    it('return status 200', async () => {
      const response = await chai.request(app)
        .get('/leaderboard/away');

      expect(response.status).to.equal(200);
    })

    it('should return leaderboard home', async () => {
      const response = await chai.request(app)
        .get('/leaderboard/away')

      expect(response.body).to.deep.equal([leaderboardMock]);
    })

    it('should return array', async () => {
      const response = await chai.request(app)
        .get('/leaderboard/away')

      expect(typeof response.body).to.equal('object');
    })
  })

  describe('function order', () => {
    beforeEach(() => {
      sinon.stub(leaderboard, 'order').resolves(leaderboardMock);
    })
    afterEach(() => {
      sinon.restore();
    })

    it('return status 200', async () => {
      const response = await chai.request(app)
        .get('/leaderboard/away');

      expect(response.status).to.equal(200);
    })

    it('should return leaderboard home', async () => {
      const response = await chai.request(app)
        .get('/leaderboard/away')

      expect(response.body).to.deep.equal(leaderboardMock);
    })

    it('should return array', async () => {
      const response = await chai.request(app)
        .get('/leaderboard/away')

      expect(typeof response.body).to.equal('object');
    })
  })
})