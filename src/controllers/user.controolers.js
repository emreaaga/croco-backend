import { userService } from '../services/index.js';

export const getUsersController = async (request, response) => {
  const { data, pagination } = await userService.getAll(request?.validatedData);
  return response.status(200).json({
    success: true,
    data,
    pagination,
  });
};

export const changeUserStatusController = async (request, response) => {
  await userService.updateStatus(request?.validatedData?.status, Number(request.params?.id));
  return response.status(200).json({ success: true, message: 'User status updated successfully.' });
};
