export default {
  async getCompanyList({ commit }, query ) {
    try {
      const res = await this.$axios({
        method: 'get',
        url: `/company`
      })
      if(res && res.data){
        commit("SET_COMPANY_LIST", res.data);
      }
    } catch (error) {
      throw error
    }
  },
};
