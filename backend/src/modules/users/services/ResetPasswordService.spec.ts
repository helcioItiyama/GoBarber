import AppError from '@shared/error/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonnhy Bee Good',
      email: 'jbgood@hotmail.com',
      password: '123123',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      token,
      password: '456456',
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('456456');
    expect(updatedUser?.password).toBe('456456');
  });

  it('should not be able to reset the password with a non-existent token', async () => {
    await expect(
      resetPassword.execute({
        token: 'non-existent token',
        password: '456456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with a non-existent user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existent-user',
    );

    await expect(
      resetPassword.execute({
        token,
        password: '456456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if passed 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonnhy Bee Good',
      email: 'jbgood@hotmail.com',
      password: '123123',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setDate(customDate.getDate() + 3);
    });

    await expect(
      resetPassword.execute({
        token,
        password: '456456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
