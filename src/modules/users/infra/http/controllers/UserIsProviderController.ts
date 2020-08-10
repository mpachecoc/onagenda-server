import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateUserIsProviderService from '@modules/users/services/UpdateUserIsProviderService';

export default class UserIsProviderController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { user_id, is_provider } = request.body;

    const updateUserIsProvider = container.resolve(UpdateUserIsProviderService);

    const user = await updateUserIsProvider.execute({
      user_id,
      is_provider,
    });

    return response.json(classToClass(user));
  }
}
