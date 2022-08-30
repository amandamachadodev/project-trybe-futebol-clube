import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { IUser } from '../interfaces/index';
import User from '../models/User';

dotenv.config();

export default class LoginService {
  public user;
  constructor() {
    this.user = User;
  }

  public login = async (body: IUser) => {
    const { email, password } = body;
    const result = await this.user.findOne({
      attributes: { exclude: ['id', 'username', 'role'] },
      where: { email },
    });

    if (!result || !bcrypt.compare(password, result.password)) {
      return false;
    }

    const token = jwt.sign({ email, password }, process.env.JWT_SECRET || 'jwt_secret');

    return { token };
  };

  public validateToken = async (token:string) => {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret');
    const { email } = user as jwt.JwtPayload;
    if (!user) {
      return false;
    }
    const validate = await this.user.findOne({
      attributes: { exclude: ['id', 'username', 'password'] },
      where: { email },
    });
    return validate;
  };
}
