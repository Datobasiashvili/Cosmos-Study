export const getToken = async (getAccessTokenSilently, loginWithRedirect) => {
  try {
    return await getAccessTokenSilently();
  } catch (err) {
    if (err.error === 'invalid_grant' || err.message?.includes('invalid refresh token')) {
      await loginWithRedirect();
      return null;
    }
    throw err;
  }
};