import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as sinon from 'sinon';
import { app } from '../app';
import { IToken } from '../database/interfaces';
import Matches from '../database/models/Matches';
import User from '../database/models/User';
import LoginService from '../database/services/loginService';
import MatchesService from '../database/services/matchesService';
import { LoginMock, validateMock } from './login.test';
const { expect } = chai;

chai.use(chaiHttp);

const matchesMock = {
  id: 1,
  homeTeam: 16,
  homeTeamGoals: 1,
  awayTeam: 8,
  awayTeamGoals: 1,
  inProgress: false,
  teamHome: {
    teamName: "São Paulo"
  },
  teamAway: {
    teamName: "Grêmio"
  }
}

const createMatchesMock = {
  homeTeam: 16,
  awayTeam: 8,
  homeTeamGoals: 2,
  awayTeamGoals: 2
}

const createdMatchesMock = {
  id: 1,
  homeTeam: 16,
  homeTeamGoals: 2,
  awayTeam: 8,
  awayTeamGoals: 2,
  inProgress: true
}

const updateGoals = {
  homeTeamGoals: 3,
  awayTeamGoals: 1
}

describe('Matches', () => {
  describe('list', () => {
    beforeEach(() => {
      sinon.stub(Matches, "findAll").resolves([matchesMock as unknown as Matches]);
    })
    afterEach(() => {
      sinon.restore();
    })

    it('return status 200', async () => {
      const response = await chai.request(app)
        .get('/matches');

      expect(response.status).to.equal(200);
    })

    it('should return matches', async () => {
      const response = await chai.request(app)
        .get('/matches')

      expect(response.body).to.deep.equal([matchesMock]);
    })
  })

  describe('list error', () => {
    beforeEach(() => {
      sinon.stub(MatchesService, 'list').resolves();
    })
    afterEach(() => {
      sinon.restore();
    })

    it('return status 404', async () => {
      const response = await chai.request(app)
        .get('/matches');

      expect(response.status).to.equal(404);
    })

    it('should error return matches', async () => {
      const response = await chai.request(app)
        .get('/matches')

      expect(response.body).to.deep.equal({ message: 'Not found' });
    })
  })

  describe('list error', () => {
    beforeEach(() => {
      sinon.stub(MatchesService, 'list').resolves();
    })
    afterEach(() => {
      sinon.restore();
    })

    it('return status 404', async () => {
      const response = await chai.request(app)
        .get('/matches');

      expect(response.status).to.equal(404);
    })

    it('should error return matches', async () => {
      const response = await chai.request(app)
        .get('/matches')

      expect(response.body).to.deep.equal({ message: 'Not found' });
    })
  })

  describe('Save matches', () => {
    beforeEach(() => {
      sinon.stub(Matches, "create").resolves();
    })

    afterEach(() => {
      sinon.restore();
    })

    it('return status 401', async () => {
      const response = await chai.request(app)
        .post('/matches')
        .send(matchesMock);

      expect(response.status).to.equal(401);
    })

    it('should return error created matches', async () => {
      const response = await chai.request(app)
        .post('/matches')
        .send(createMatchesMock);

      expect(response.body).to.deep.equal({message: 'Token must be a valid token'});
    })
  })

  describe('Save matches invalid token', () => {
    beforeEach(() => {
      sinon.stub(MatchesService, 'saveMatches').resolves(matchesMock as unknown as Matches);
    })
    afterEach(() => {
      sinon.restore();
    })

    it('return status 404', async () => {
      const response = await chai.request(app)
        .post('/matches').send({id: 1});

      expect(response.status).to.equal(401);
    })

    it('should error save matches', async () => {
      const response = await chai.request(app)
        .post('/matches').send({id: 1})

      expect(response.body).to.deep.equal({ message: 'Token must be a valid token' });
    })
  })

  describe('Update matches', () => {
    beforeEach(() => {
      sinon.stub(Matches, "update").resolves([1, []]);
    })

    afterEach(() => {
      sinon.restore();
    })

    it('return status 200', async () => {
      const response = await chai.request(app)
        .patch('/matches/:id/finish')
        .send({id: 1});

      expect(response.status).to.equal(200);
    })

    it('should return update matches', async () => {
      const response = await chai.request(app)
        .patch('/matches/:id/finish')
        .send({id: 1});

      expect(response.body).to.deep.equal({ message: 'Finished' });
    })
  })

  describe('Update goals', () => {
    beforeEach(() => {
      sinon.stub(Matches, "update").resolves([1, []]);
    })

    afterEach(() => {
      sinon.restore();
    })

    it('return status 200', async () => {
      const response = await chai.request(app)
        .patch('/matches/:id')
        .send({id: 1});

      expect(response.status).to.equal(200);
    })

    it('should return update goals', async () => {
      const response = await chai.request(app)
        .patch('/matches/:id')
        .send({id: 1});

      expect(response.body).to.deep.equal({ message: 'Updated' });
    })
  })
})