import jwt from 'jsonwebtoken';

export const authMiddleware = async (request, response, next) => {
  const token = request.cookies?.access_token;
  if (!token) return response.status(401).json({ message: 'Not authenticated.' });

  try {
    const encoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!encoded?.id) {
      return response.status(401).json({ success: false, message: 'Invalid token payload' });
    }
    request.userId = encoded.id;
    next();
  } catch (error) {
    console.error('JWT error', error.message);
    return response.status(401).json({ message: 'Session expired or invalid' });
  }
};
