export default {
  SET_USER_LIST(state, users) {
    state.userList = users.users;
    state.countUsers = users.count;
  },
  SET_USER_PAGE(state, page) {
    state.page = page
  }
};
