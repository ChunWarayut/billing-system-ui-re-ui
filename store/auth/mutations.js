export default {
  SET_AUTH(state, auth) {
    state.accessToken = auth.accessToken;
    state.user = auth.user;
    state.isLoggedIn = true;
    state.permissions = auth.user && auth.user.permissions
  },
  SET_LOGOUT(state, auth) {
    state.accessToken = null;
    state.user = null;
    state.isLoggedIn = false;
    state.permissions = []
  },
};
