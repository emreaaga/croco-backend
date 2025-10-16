import { getUsers } from '../models/user.model.js';

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
    return response.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};
