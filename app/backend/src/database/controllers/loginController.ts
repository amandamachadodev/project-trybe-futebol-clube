import { Request, Response } from 'express';
import LoginService from '../services/loginService';

export default class LoginController {
  public loginService;

  constructor() {
    this.loginService = new LoginService();
  }

  public login = async (req: Request, res: Response) => {
    if (!req.body.email.length || !req.body.password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    const user = await this.loginService.login(req.body);

    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    return res.status(200).json(user);
  };
}
