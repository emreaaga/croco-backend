import { userRepository } from '../repositories/index.js';

class UserService {
  async getAll(validatedData) {
    if (!validatedData) {
      throw new Error('Validation data is required');
    }
    const users = await userRepository.findAll(validatedData.page, validatedData.page_size);
    return users;
  }

  async updateStatus(userStatus, userId) {
    if (!userStatus || !userId) {
      throw new Error('User status or ID not provided.');
    }

    const allowedStatuses = ['approved', 'rejected'];
    if (!allowedStatuses.includes(userStatus)) {
      throw new Error('Invalid user status value.');
    }

    const [result] = await userRepository.updateStatus(userId, userStatus);
    if (!result) {
      throw new Error('User not found.');
    }

    return result;
  }
}

export const userService = new UserService();
