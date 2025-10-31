import { userRepository } from '../repositories/index.js';
import { BadRequestError, NotFoundError } from '../utils/index.js';

class UserService {
  async getAll(validatedData) {
    if (!validatedData) {
      throw new BadRequestError('Validation data is required');
    }
    const users = await userRepository.findAll(validatedData.page, validatedData.page_size);
    return users;
  }

  async updateStatus(userStatus, userId) {
    if (!userStatus || !userId) {
      throw new BadRequestError('User status or ID not provided.');
    }

    const allowedStatuses = ['approved', 'rejected'];
    if (!allowedStatuses.includes(userStatus)) {
      throw new BadRequestError('Invalid user status value.');
    }

    const [result] = await userRepository.updateStatus(userId, userStatus);
    if (!result) {
      throw new NotFoundError('User not found.');
    }

    return result;
  }
}

export const userService = new UserService();
