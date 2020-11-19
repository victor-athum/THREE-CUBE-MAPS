import moment from 'moment';
import SessionAction from '../stores/session/actions';

const checkUserInSession = (cookies, dispatch) => {
  const cookiesVars = cookies.getAll();
  const actualTime = moment().format('x');
  const {
    token: tokenFromCookies = '',
    user: userFromCookies = {},
    refreshToken: refreshTokenFromCookies = '',
    expirationTime: expirationTimeFromCookies = 0,
    accessToken: accessTokenFromCookies = ''
  } = cookiesVars;
  const tokenFromSession = sessionStorage.getItem('token') || '';
  const userFromSession = JSON.parse(sessionStorage.getItem('user')) || {};
  const refreshTokenSession = sessionStorage.getItem('refreshToken') || '';
  const expirationTimeSession = sessionStorage.getItem('expirationTime') || 0;
  const accessTokenSession = sessionStorage.getItem('accessToken') || '';
  if (tokenFromSession && refreshTokenSession) {
    if (actualTime >= expirationTimeSession) {
      dispatch(
        SessionAction.refreshLogin(
          userFromSession.email,
          refreshTokenSession,
          cookies
        )
      );
    } else {
      dispatch(
        SessionAction.setUserFromSession(
          tokenFromSession,
          userFromSession,
          refreshTokenSession,
          expirationTimeSession,
          accessTokenSession,
          cookies
        )
      );
    }
  } else if (tokenFromCookies && refreshTokenFromCookies) {
    if (actualTime >= expirationTimeFromCookies) {
      dispatch(
        SessionAction.refreshLogin(
          userFromCookies.email,
          refreshTokenFromCookies,
          cookies
        )
      );
    } else {
      dispatch(
        SessionAction.setUserFromCookies(
          tokenFromCookies,
          userFromCookies,
          refreshTokenFromCookies,
          expirationTimeFromCookies,
          accessTokenFromCookies
        )
      );
    }
  }
};

export default checkUserInSession;
