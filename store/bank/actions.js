export default {
  async getBankList({ commit } ) {
    try {
      const res = await this.$axios({
        method: 'get',
        url: `/banks`
      })
      if(res && res.data){
        commit("SET_BANK_LIST", res.data);
      }
    } catch (error) {
      throw error
    }
  },
};
