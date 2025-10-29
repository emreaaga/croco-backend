import { applicationService } from '../services/index.js';

export const createApplicationController = async (request, response) => {
  try {
    const result = await applicationService.create(request.validatedData);
    return response.status(201).json({
      success: true,
      message: 'Application created successfully.',
      data: result,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getApplicationsController = async (request, response) => {
  try {
    const { data, pagination } = await applicationService.getAll(request.validatedData);
    return response.status(200).json({
      success: true,
      data,
      pagination,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};
