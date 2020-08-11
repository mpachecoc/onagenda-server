import { injectable, inject } from 'tsyringe';
import { getHours, getMinutes, isAfter } from 'date-fns';
import appointmentConfig from '@config/appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  minute: number;
  available: boolean;
}>;

@injectable()
class ListProvidersDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    const { hourStart, hourEnd, minutesInterval } = appointmentConfig.settings;

    // Create all possible time intervals array
    const eachHourArray = [];
    const lenght = 60 / minutesInterval;

    for (let iHour = hourStart; iHour < hourEnd; iHour += 1) {
      for (let minCount = 0; minCount < lenght; minCount += 1) {
        eachHourArray.push({
          hour: iHour,
          minutes: minutesInterval * minCount,
        });
      }
    }

    const currentDate = new Date(Date.now());

    // Add availability of each time interval
    const availability = eachHourArray.map(time => {
      const hasAppointmentInHourMin = appointments.find(
        appointment =>
          getHours(appointment.date) === time.hour &&
          getMinutes(appointment.date) === time.minutes,
      );

      const compareDate = new Date(
        year,
        month - 1,
        day,
        time.hour,
        time.minutes,
      );

      return {
        hour: time.hour,
        minute: time.minutes,
        available:
          !hasAppointmentInHourMin && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProvidersDayAvailabilityService;
