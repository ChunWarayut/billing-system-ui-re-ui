const state = require("./state")

export default {
  async getUserList({ commit, state }, { searchText, page }) {
    let pageSize = state.pageSize
    if(searchText){
      page = 1
    }
    commit("SET_USER_PAGE", page);
    try {
      const res = await this.$axios({
        method: 'get',
        url: `/users?page=${page}&pageSize=${pageSize}&search=${searchText || "" }`
      })
      if(res && res.data){
        commit("SET_USER_LIST", res.data);
      }
    } catch (error) {
      throw error
    }
  },
  async createUser({ commit }, data) {
    try {
      await this.$axios({
        method: 'post',
        url: '/users',
        data
      })
    } catch (error) {
      throw error
    }
  },
  async updateUser({ commit }, data) {
    try {
      let id = data.id
      delete data.id
      data = { ...data, password: data.newPassword}
      await this.$axios({
        method: 'put',
        url: `/users/${id}`,
        data
      })
    } catch (error) {
      throw error
    }
  },
  async deleteUser({ commit }, id) {
    try {
      await this.$axios({
        method: 'delete',
        url: `/users/${id}`
      })
    } catch (error) {
      throw error
    }
  },
};
