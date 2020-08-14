import AppError from '@shared/error/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      user_id: '12121221',
      date: new Date(2020, 4, 10, 13),
      provider_id: '12121212',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('12121212');
  });

  it('should not be able to create two appointments at the same date', async () => {
    const appointmentDate = new Date(2020, 4, 11, 13);

    await createAppointment.execute({
      user_id: 'user',
      date: appointmentDate,
      provider_id: 'provider',
    });

    await expect(
      createAppointment.execute({
        user_id: 'user',
        date: appointmentDate,
        provider_id: 'provider',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    await expect(
      createAppointment.execute({
        user_id: '12212122',
        date: new Date(2020, 4, 10, 11),
        provider_id: '12121212',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment to himself', async () => {
    await expect(
      createAppointment.execute({
        user_id: '1212',
        date: new Date(2020, 4, 10, 13),
        provider_id: '1212',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    await expect(
      createAppointment.execute({
        user_id: '121231212',
        date: new Date(2020, 4, 11, 7),
        provider_id: 'provider',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        user_id: '121231212',
        date: new Date(2020, 4, 11, 18),
        provider_id: 'provider',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
