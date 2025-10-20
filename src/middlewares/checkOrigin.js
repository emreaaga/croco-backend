export const checkOriginAndReferer = async (request, response, next) => {
  const origin = request.headers.origin;
  const referer = request.headers.referer;
  const allowed = process.env.CLIENT_URL;

  if (origin) {
    if (origin !== allowed) {
      return response.status(403).json({
        success: false,
        message: 'Blocked by Origin check',
      });
    }
  } else if (referer) {
    if (!referer.startsWith(allowed)) {
      return response.status(403).json({
        success: false,
        message: 'Blocked by Referer check',
      });
    }
  } else {
    return response.status(403).json({
      success: false,
      message: 'No Origin or Referer provided',
    });
  }
  next();
};
