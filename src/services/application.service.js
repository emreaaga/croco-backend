import { applicationRepository } from '../repositories/index.js';

class ApplicationService {
  async create(data) {
    const result = await applicationRepository.create(data);
    return result;
  }

  async getAll(data) {
    const result = await applicationRepository.findAll(data.page, data.page_size);
    return result;
  }
}

export const applicationService = new ApplicationService();
