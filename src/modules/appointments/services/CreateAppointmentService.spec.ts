import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 22, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 7, 22, 13),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider_id');
  });

  it('should not be able to create two appointments at the same time', async () => {
    const appointmentDate = new Date(2025, 6, 14, 11);

    await createAppointment.execute({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: appointmentDate,
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider_id',
        user_id: 'user_id',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 22, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider_id',
        user_id: 'user_id',
        date: new Date(2020, 7, 22, 11),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment being same user and provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 22, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'user_id',
        user_id: 'user_id',
        date: new Date(2020, 7, 22, 13),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 08:00 & after 17:00', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 22, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider_id',
        user_id: 'user_id',
        date: new Date(2020, 7, 23, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        provider_id: 'provider_id',
        user_id: 'user_id',
        date: new Date(2020, 7, 23, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
