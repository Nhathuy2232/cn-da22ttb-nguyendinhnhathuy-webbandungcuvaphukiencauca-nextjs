import userRepository, { UserRecord } from '../../infrastructure/repositories/userRepository';

class UserService {
  list(): Promise<UserRecord[]> {
    return userRepository.list();
  }
}

const userService = new UserService();

export default userService;

