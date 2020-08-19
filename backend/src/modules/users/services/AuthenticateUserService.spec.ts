import AppError from '@shared/error/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Johnny B Good',
      email: 'johnnybgood@gmail.com',
      password: '121212',
    });

    const response = await authenticateUser.execute({
      email: 'johnnybgood@gmail.com',
      password: '121212',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate a non-existent user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'nonexistentuser@gmail.com',
        password: '121212',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate an user with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'Right User',
      email: 'rightUser@gmail.com',
      password: '121212',
    });

    await expect(
      authenticateUser.execute({
        email: 'rightUser@gmail.com',
        password: '121213',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
