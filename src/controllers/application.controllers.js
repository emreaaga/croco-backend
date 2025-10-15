import { createApplication } from '../models/application.model.js';

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
