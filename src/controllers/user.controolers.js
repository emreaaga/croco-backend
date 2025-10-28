import { getUsers, changeUserStatus } from '../repositories/user.repository.js';

export const getUsersController = async (request, response) => {
  try {
    const queryData = request.validatedData;
    const users = await getUsers(queryData.page, queryData.page_size);

    return response.status(200).json({
      success: true,
      data: users.data,
      pagination: users.pagination,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const changeUserStatusController = async (request, response) => {
  try {
    const user_status = request?.validatedData?.status;
    const user_id = Number(request.params?.id);
    if (!user_status || !user_id) {
      return response.status(400).json({ message: 'User status or ID not provided.' });
    }

    const allowedStatuses = ['approved', 'rejected'];
    if (!allowedStatuses.includes(user_status)) {
      return response.status(400).json({ success: false, message: 'Invalid user status value.' });
    }

    const [result] = await changeUserStatus(user_id, user_status);
    if (!result) {
      return response.status(404).json({ success: false, message: 'User not found.' });
    }

    return response
      .status(200)
      .json({ success: true, message: 'User status updated successfully.', data: result });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: 'Server error.' });
  }
};
