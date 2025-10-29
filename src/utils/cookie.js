const isProd = process.env.NODE_ENV === 'production';

const cookieOptions = {
  access: {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
    path: '/',
    domain: isProd ? '.crocodile-pay.uz' : undefined,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  },
  refresh: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
    domain: isProd ? '.crocodile-pay.uz' : undefined,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  },
};

export const setAuthCookies = (response, accessToken, refreshToken) => {
  response.cookie('access_token', accessToken, cookieOptions.access);
  response.cookie('refresh_token', refreshToken, cookieOptions.refresh);
};
export const clearAuthCookies = response => {
  response.clearCookie('access_token', cookieOptions.access);
  response.clearCookie('refresh_token', cookieOptions.refresh);
};
