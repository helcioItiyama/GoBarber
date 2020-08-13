import AppError from '@shared/error/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jdoe@gmail.com',
      password: '321321',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'john.tre@gmail.com',
    });

    expect(updatedUser.name).toBe('John Tre');
    expect(updatedUser.email).toBe('john.tre@gmail.com');
  });

  it('should not be able to update the profile with an existent email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jdoe@gmail.com',
      password: '321321',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Trê',
      email: 'jTre@gmail.com',
      password: '321321',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Tres',
        email: 'jdoe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jdoe@gmail.com',
      password: '321321',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'john.tre@gmail.com',
      old_password: '321321',
      password: '456456',
    });

    expect(updatedUser.password).toBe('456456');
  });

  it('should be not able to update without passing the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jdoe@gmail.com',
      password: '321321',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'john.tre@gmail.com',
        password: '456456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to update with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jdoe@gmail.com',
      password: '321321',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'john.tre@gmail.com',
        old_password: '123123',
        password: '456456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile from a non-existent user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existent user',
        name: 'Johnny B Good',
        email: 'test@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
