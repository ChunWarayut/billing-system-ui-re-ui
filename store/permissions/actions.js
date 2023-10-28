export default {
  async getPermissionList({ commit } ) {
    try {
      const res = await this.$axios({
        method: 'get',
        url: `/permissions`
      })
      if(res && res.data){
        commit("SET_PERMISSION_LIST", res.data);
      }
    } catch (error) {
      throw error
    }
  }
};
