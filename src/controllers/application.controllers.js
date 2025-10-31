import { applicationService } from '../services/index.js';

export const createApplicationController = async (request, response) => {
  const result = await applicationService.create(request.validatedData);
  return response.status(201).json({
    success: true,
    message: 'Application created successfully.',
    data: result,
  });
};

export const getApplicationsController = async (request, response) => {
  const { data, pagination } = await applicationService.getAll(request.validatedData);
  return response.status(200).json({
    success: true,
    data,
    pagination,
  });
};
