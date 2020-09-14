import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateSessionService from '@modules/users/services/CreateSessionService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, username, password } = request.body;
    const createSession = container.resolve(CreateSessionService);
    const { user, token } = await createSession.execute({
      email,
      username,
      password,
    });

    return response.json({ user: classToClass(user), token });
  }
}
