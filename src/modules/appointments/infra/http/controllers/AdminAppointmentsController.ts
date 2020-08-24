import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListUserAppointmentsService from '@modules/appointments/services/ListUserAppointmentsService';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AdminAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;

    const listUserAppointments = container.resolve(ListUserAppointmentsService);

    const appointments = await listUserAppointments.execute({
      user_id,
    });

    return response.json(classToClass(appointments));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { user_id, provider_id, date } = request.body;

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      provider_id,
      user_id,
      date,
    });

    return response.json(appointment);
  }
}
