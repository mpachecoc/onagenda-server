import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AdminAppointmentsController from '../controllers/AdminAppointmentsController';

const adminAppointmentsRouter = Router();
const adminAppointmentsController = new AdminAppointmentsController();

adminAppointmentsRouter.use(ensureAuthenticated);

adminAppointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      user_id: Joi.string().uuid().required(),
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  adminAppointmentsController.create,
);

adminAppointmentsRouter.get(
  '/:user_id',
  celebrate({
    [Segments.PARAMS]: {
      user_id: Joi.string().uuid().required(),
    },
  }),
  adminAppointmentsController.index,
);

export default adminAppointmentsRouter;
