import jwt from 'jsonwebtoken';

export const authMiddleware = async (request, response, next) => {
  const token = request.cookies?.access_token;
  if (!token) return response.status(401).json({ message: 'Not authenticated.' });

  try {
    jwt.verify(token, 'process.env.JWT_SECRET');
    next();
  } catch (error) {
    console.error('JWT error', error.message);
    return response.status(401).json({ message: 'Session expired or invalid' });
  }
};
