import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  is_provider: boolean;
}

@injectable()
class UpdateUserIsProviderService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id, is_provider }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User ID was not found');
    }

    user.is_provider = is_provider;
    await this.usersRepository.save(user);

    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}

export default UpdateUserIsProviderService;
