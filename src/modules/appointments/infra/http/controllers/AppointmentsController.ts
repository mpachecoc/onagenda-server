import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ListUserAppointmentsService from '@modules/appointments/services/ListUserAppointmentsService';
import DeleteAppointmentService from '@modules/appointments/services/DeleteAppointmentService';

export default class AppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listUserAppointments = container.resolve(ListUserAppointmentsService);

    const appointments = await listUserAppointments.execute({
      user_id,
    });

    return response.json(classToClass(appointments));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date } = request.body;

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      provider_id,
      user_id,
      date,
    });

    return response.json(appointment);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteAppointment = container.resolve(DeleteAppointmentService);

    await deleteAppointment.execute({
      appointment_id: id,
    });

    return response.send();
  }
}
