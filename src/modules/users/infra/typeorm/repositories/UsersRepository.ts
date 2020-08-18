import { getRepository, Repository, Not, Like } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  // Find Users
  public async findAll(query?: string | undefined): Promise<User[]> {
    let users;

    if (query) {
      users = await this.ormRepository.find({
        where: [{ name: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
      });
    } else {
      users = await this.ormRepository.find();
    }

    return users;
  }

  // Find by ID
  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  // Find by Email
  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });

    return user;
  }

  // Find All Providers: true (optional: exclude user itself)
  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
          is_provider: true,
        },
      });
    } else {
      users = await this.ormRepository.find({
        where: { is_provider: true },
      });
    }

    return users;
  }

  // Create
  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return user;
  }

  // Save (update)
  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
