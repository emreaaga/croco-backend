import { getUsers } from '../models/user.model.js';

export const getUsersController = async (request, response) => {
  try {
    let page = parseInt(request.query.page || 1);
    let page_size = parseInt(request.query.page_size || 4);
    if (page < 1) page = 1;
    if (page_size < 1) page_size = 4;

    const users = await getUsers(page, page_size);

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
