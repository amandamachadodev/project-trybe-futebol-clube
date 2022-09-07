import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as sinon from 'sinon';
import { app } from '../app';
import Teams from '../database/models/Teams';
import { ITeams } from '../database/interfaces';
const { expect } = chai;

chai.use(chaiHttp);

const teamsMock: ITeams = {
  id: 1,
  teamName: 'Avaí/Kindermann'
}

describe('Teams', () => {
  describe('list', () => {
    beforeEach(() => {
      sinon.stub(Teams, "findAll").resolves([teamsMock as Teams]);
    })
    afterEach(() => {
      sinon.restore();
    })

    it('return status 200', async () => {
      const response = await chai.request(app)
        .get('/teams');

      expect(response.status).to.equal(200);
    })

    it('should return teams', async () => {
      const response = await chai.request(app)
        .get('/teams');


      expect(response.body).to.deep.equal([teamsMock]);
    })
  })

  describe('Find By Pk', () => {
    beforeEach(() => {
      sinon.stub(Teams, "findByPk").resolves(teamsMock as Teams);
    })

    afterEach(() => {
      sinon.restore();
    })

    it('return status 200', async () => {
      const response = await chai.request(app)
        .get('/teams/:id')
        .send({id: 1});;

      expect(response.status).to.equal(200);
    })

    it('should return team id', async () => {
      const response = await chai.request(app)
        .get('/teams/:id')
        .send({id: 1});
        
      expect(response.body).to.deep.equal(teamsMock);
    })
  })
})