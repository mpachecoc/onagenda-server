import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  // Find By Id
  public async findById(
    appointment_id: string,
  ): Promise<Appointment | undefined> {
    const appointment = await this.ormRepository.findOne(appointment_id);

    return appointment;
  }

  // List Appointments by user_id
  public async findAll(user_id: string): Promise<Appointment[]> {
    const foundAppointments = await this.ormRepository.find({
      where: { user_id },
      relations: ['provider'],
    });

    return foundAppointments;
  }

  // Find By Date
  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const foundAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return foundAppointment;
  }

  // Find All in Month (by provider)
  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0'); // So months have 01, 02, etc.

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });
    return appointments;
  }

  // Find All in Day (by provider)
  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0'); // So months have 01, 02, etc.

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      order: {
        date: 'ASC',
      },
      relations: ['user'],
    });
    return appointments;
  }

  // Create
  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }

  // Delete Appointment
  public async delete(appointment_id: string): Promise<void> {
    await this.ormRepository.delete(appointment_id);
  }
}

export default AppointmentsRepository;
