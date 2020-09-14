import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import AppError from '@shared/errors/AppError';

import { injectable, inject } from 'tsyringe';

interface IRequestDTO {
  username: string;
  email: string;
  password: string;
}
@injectable()
class CreateUserService {
  constructor(
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('UserRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    username,
    email,
    password,
  }: IRequestDTO): Promise<User> {
    const checkEmailExists = await this.usersRepository.findByEmail(email);
    const checkUsernameExists = await this.usersRepository.findByUsername(
      username,
    );
    if (checkEmailExists) {
      throw new AppError('Email adress already used');
    }
    if (checkUsernameExists) {
      throw new AppError('Username already used');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      blocked: false,
    });

    return user;
  }
}
export default CreateUserService;
