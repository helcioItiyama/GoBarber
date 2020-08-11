import AppError from '@shared/error/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '343434',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('john_doe@gmail.com');
  });

  it('should not be able to create a new user with an already existent email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '343434',
    });

    expect(
      createUser.execute({
        name: 'Johnny B Good',
        email: 'john_doe@gmail.com',
        password: '898989',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
