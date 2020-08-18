import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  query?: string | undefined;
}

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ query }: IRequest): Promise<User[]> {
    const users = await this.usersRepository.findAll(query);

    return users;
  }
}

export default ListUsersService;
