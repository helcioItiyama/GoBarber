import AppError from '@shared/error/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;

let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '343434',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('john_doe@gmail.com');
  });

  it('should not be able to create a new user with an already existent email', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '343434',
    });

    await expect(
      createUser.execute({
        name: 'Johnny B Good',
        email: 'john_doe@gmail.com',
        password: '898989',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
