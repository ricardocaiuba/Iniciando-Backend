import { Request, Response } from "express";
import { container } from "tsyringe";

import AuthenticateUserService from "@modules/users/services/AuthenticateUserService";

class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const authenticaterUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticaterUser.execute({
      email,
      password,
    });

    delete user.password;

    return res.json({ user, token });
  }
}

export default SessionsController;
