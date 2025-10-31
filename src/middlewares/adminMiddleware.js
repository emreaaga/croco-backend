import { UnauthorizedError, ForbiddenError } from '../utils/index.js';

export const isAdminMiddleware = async (request, response, next) => {
  const userRole = request.userRole;

  if (!userRole) {
    throw new UnauthorizedError('Unauthorized: missing role.');
  }

  const allowed = ['admin'];
  if (!allowed.includes(userRole)) {
    throw new ForbiddenError('Access denied.');
  }

  next();
};
