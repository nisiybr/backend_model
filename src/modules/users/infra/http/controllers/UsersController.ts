import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/CreateUserService';

import { container } from 'tsyringe';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { username, email, password } = request.body;

      const createUser = container.resolve(CreateUserService);

      const user = await createUser.execute({
        username,
        email,
        password,
      });

      return response.json({ user: classToClass(user) });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
}
