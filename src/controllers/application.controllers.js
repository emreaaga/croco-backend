import { applicationRepository } from '../repositories/index.js';

export const createApplicationController = async (request, response) => {
  try {
    const result = await applicationRepository.create(request.validatedData);
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
    const queryData = request.validatedData;
    const { data, pagination } = await applicationRepository.findAll(
      queryData.page,
      queryData.page_size
    );

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
