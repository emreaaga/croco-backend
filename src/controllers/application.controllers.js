import { createApplication, getApplications } from '../models/application.model.js';

export const createApplicationController = async (request, response) => {
  try {
    const result = await createApplication(request.validatedData);
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
    let page = parseInt(request.query.page || 1);
    let page_size = parseInt(request.query.page_size || 10);
    if (page < 1) page = 1;
    if (page_size < 1) page_size = 10;

    const { data, pagination } = await getApplications(page, page_size);
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
