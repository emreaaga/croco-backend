import { UnauthorizedError } from '../utils/index.js';
import { jwtService } from '../utils/index.js';

export const authMiddleware = async (request, response, next) => {
  const token = request.cookies?.access_token;
  if (!token) throw new UnauthorizedError('Not authenticated.');

  const encoded = jwtService.verifyAccess(token);
  if (!encoded?.id) {
    throw new UnauthorizedError('Invalid token payload.');
  }
  request.userId = encoded.id;
  request.userRole = encoded.role;
  next();
};
