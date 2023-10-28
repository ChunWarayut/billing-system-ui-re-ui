export default {
  user(state) {
    return state.user;
  },
  accessToken(state) {
    return state.accessToken;
  },
  isLoggedIn(state) {
    return state.isLoggedIn;
  },
  userPermissions(state) {
    return state.permissions;
  }
};
