import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as sinon from 'sinon';
import { app } from '../app';
import User from '../database/models/User';
import { IToken, IUser, IValid } from '../database/interfaces';
import LoginService from '../database/services/loginService';
const { expect } = chai;

chai.use(chaiHttp)

export const userMock: IUser = {
  email: 'any-email',
  password: 'any-secret'
}

export const validateMock: IValid = {
  role: 'any-role'
}

export const LoginMock: IToken = { 
  token: 'any-token'
}

describe('Login', () => {
  describe('FindOne', () => {
    beforeEach(() => {
      sinon.stub(User, "findOne").resolves(userMock as  User);
    })
    afterEach(() => {
      sinon.restore();
    })

    it('return status 200', async () => {
      const response = await chai.request(app)
        .post('/login')
        .send(userMock);

      expect(response.status).to.equal(200);
    })

    it('should return crypto', async () => {
      sinon.stub(bcrypt, "compareSync").returns(true);
      const response = await chai.request(app)
        .post('/login')
        .send(userMock);

      expect(response.body).to.have.key('token');
    })

    it('should return incorrect email or password', async () => {
      sinon.stub(LoginService, 'login').resolves(false as unknown as IToken);
      const response = await chai.request(app)
        .post('/login')
        .send(userMock);

      expect(response.body).to.deep.equal({ message: 'Incorrect email or password'});
    })

    it('should return token', async () => {
      sinon.stub(LoginService, 'login').resolves(LoginMock as IToken);
      const response = await chai.request(app)
        .post('/login')
        .send(userMock);

      expect(response.body).to.deep.equal(LoginMock);
    })
  })

  describe('Login validate', () => {
    beforeEach(() => {
      sinon.stub(User, "findOne").resolves(userMock as User);
    })

    afterEach(() => {
      sinon.restore();
    })

    it('return status 404', async () => {
      sinon.stub(LoginService, 'login').resolves(LoginMock as IToken);
      sinon.stub(LoginService, 'validateToken').resolves(false);

      const response = await chai.request(app)
        .get('/login/validate');

      expect(response.status).to.equal(404);
    })

    it('should return validate', async () => {
      sinon.stub(LoginService, 'validateToken').resolves(false);
      const response = await chai.request(app)
        .get('/login/validate')
        .send(LoginMock);

      expect(response.body).to.deep.equal({ message: 'Invalid token' });
    })

    it('return status 200 quando token for valido', async () => {
      sinon.stub(LoginService, 'login').resolves(LoginMock as IToken);
      sinon.stub(LoginService, 'validateToken').resolves(validateMock as User);

      const response = await chai.request(app)
        .get('/login/validate').send(LoginMock);

      expect(response.status).to.equal(200);
    })

    it('return role quando token for valido', async () => {
      sinon.stub(LoginService, 'login').resolves(LoginMock as IToken);
      sinon.stub(LoginService, 'validateToken').resolves(validateMock as User);

      const response = await chai.request(app)
        .get('/login/validate').send(LoginMock);

      expect(response.body).to.deep.equal(validateMock);
    })
  })
})