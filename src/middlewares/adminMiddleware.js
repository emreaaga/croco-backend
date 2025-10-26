export const isAdminMiddleware = async (request, response, next) => {
  try {
    const userRole = request.userRole;

    if (!userRole) {
      return response.status(401).json({ success: false, message: 'Unauthorized: missing role.' });
    }

    const allowed = ['admin'];

    if (!allowed.includes(userRole)) {
      return response.status(403).json({ success: false, message: 'Access denied.' });
    }

    next();
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: 'Server error' });
  }
};
