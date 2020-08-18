import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import multer from 'multer';
import uploadConfig from '@config/upload';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';
import UserIsProviderController from '../controllers/UserIsProviderController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();
const userIsProviderController = new UserIsProviderController();
const upload = multer(uploadConfig.multer);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.get('/', usersController.index);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

usersRouter.patch(
  '/is-provider',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      user_id: Joi.string().uuid().required(),
      is_provider: Joi.boolean().required(),
    },
  }),
  userIsProviderController.update,
);

export default usersRouter;
