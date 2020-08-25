import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListUsersService from '@modules/users/services/ListUsersService';
import CreateUserService from '@modules/users/services/CreateUserService';
import GetUserService from '@modules/users/services/GetUserService';

export default class UsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { q } = request.query;

    const listUsers = container.resolve(ListUsersService);

    const users = await listUsers.execute({
      query: q as string,
    });

    return response.json(classToClass(users));
  }

  public async single(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const getUser = container.resolve(GetUserService);

    const user = await getUser.execute({
      id,
    });

    return response.json(classToClass(user));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return response.json(classToClass(user));
  }
}
