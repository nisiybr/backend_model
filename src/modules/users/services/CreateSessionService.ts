import { injectable, inject } from 'tsyringe';
import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

import { sign } from 'jsonwebtoken';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  email?: string;
  username?: string;
  password: string;
}

interface IResponseDTO {
  user: User;
  token: string;
}

@injectable()
class CreateSessionService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    username,
    password,
  }: IRequestDTO): Promise<IResponseDTO> {
    let param = '';

    if (email) {
      param = email;
    }
    if (username) {
      param = username;
    }

    const user = email
      ? await this.userRepository.findByEmail(param)
      : await this.userRepository.findByUsername(param);

    if (!user) {
      throw new AppError(
        'Incorrect email/username and password combination.',
        401,
      );
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError(
        'Incorrect email/username and password combination.',
        401,
      );
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default CreateSessionService;
