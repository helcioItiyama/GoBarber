import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to show all providers except user', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jdoe@gmail.com',
      password: '321321',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'jtre@gmail.com',
      password: '121212',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Logged User',
      email: 'loggedUser@gmail.com',
      password: '123123',
    });

    const providers = await listProviders.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([user1, user2]);
  });
});

export default ListProvidersService;
