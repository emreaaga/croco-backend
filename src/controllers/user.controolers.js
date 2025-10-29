import { userService } from '../services/index.js';

export const getUsersController = async (request, response) => {
  try {
    const { data, pagination } = await userService.getAll(request?.validatedData);
    return response.status(200).json({
      success: true,
      data,
      pagination,
    });
  } catch (error) {
    if (error.message === 'Validation data is required') {
      return response.status(400).json({ success: false, message: error.message });
    }
    console.log(error);
    return response.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const changeUserStatusController = async (request, response) => {
  try {
    await userService.updateStatus(request?.validatedData?.status, Number(request.params?.id));
    return response
      .status(200)
      .json({ success: true, message: 'User status updated successfully.' });
  } catch (error) {
    if (error.message === 'User status or ID not provided.') {
      return response.status(400).json({ success: false, message: error.message });
    } else if (error.message === 'Invalid user status value.') {
      return response.status(400).json({ success: false, message: error.message });
    } else if (error.message === 'User not found.') {
      return response.status(404).json({ success: false, message: error.message });
    }
    console.log(error);
    return response.status(500).json({ success: false, message: 'Server error.' });
  }
};
