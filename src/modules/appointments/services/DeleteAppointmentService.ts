import { injectable, inject } from 'tsyringe';
import { format } from 'date-fns';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  appointment_id: string;
}

@injectable()
class ListUserAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ appointment_id }: IRequest): Promise<void> {
    const appointment = await this.appointmentsRepository.findById(
      appointment_id,
    );

    if (!appointment) {
      throw new AppError('Appointment not found.');
    }

    await this.appointmentsRepository.delete(appointment_id);

    // Invalidate Cache
    const { provider_id, date } = appointment;

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(date, 'yyyy-M-d')}`,
    );
  }
}

export default ListUserAppointmentsService;
