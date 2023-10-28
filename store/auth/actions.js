import HttpClient from "../../utills/httpClient";
export default {
  async login({ commit },{username, password}) {
    const res = await HttpClient.login({username, password})
    if(res){
      commit("SET_AUTH", res);
      return true;
    }
    return false;
  },
  logout({commit}){
    commit("SET_LOGOUT",null);
  }
};
