export const createApplicationController = async (request, response) => {
  try {
    return response.status(201).json({
      success: true,
      message: 'Application created successfully.',
      data: request.validatedData,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
