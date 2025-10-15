export const registerController = async (request, response) => {
  try {
    return response.status(201).json({
      success: true,
      message: 'User created successfuly.',
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const loginController = async (request, response) => {
  try {
    return response.status(200).json({
      success: true,
      message: 'User loged in successfuly.',
      token: '',
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getMeController = async (request, response) => {
  try {
    return response.status(200).json({
      success: true,
      data: {},
      token: '',
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
