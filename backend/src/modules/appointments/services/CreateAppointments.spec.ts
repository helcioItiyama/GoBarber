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
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '12121212',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('12121212');
  });

  it('should not be able to create two appointments at the same date', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '12121212',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '12121212',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
