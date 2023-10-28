export default {
  async getRoleList({ commit }, query ) {
    let { includepermission, search } = query
    if(!includepermission) includepermission = ''
    if(!search) search = ''
    try {
      const res = await this.$axios({
        method: 'get',
        url: `/roles?includepermission=${includepermission}&search=${search}`
      })
      if(res && res.data){
        commit("SET_ROLE_LIST", res.data);
      }
    } catch (error) {
      throw error
    }
  },
  async createRole({ commit }, data) {
    let id = data.id
    delete data.id
    data.permissions = data.selectedPermissions
    delete data.selectedPermissions
    if(data.name){
      data.code = data.name.replace(/ /g, '+').toUpperCase()
    }
    try {
      await this.$axios({
        method: 'post',
        url: '/roles',
        data
      })
    } catch (error) {
      throw error
    }
  },
  async updateRole({ commit }, data) {
    try {
      let id = data.id
      delete data.id
      if(data.name){
        data.code = data.name.replace(/ /g, '+').toUpperCase()
      }
      data = { ...data, permissions: data.selectedPermissions}
      await this.$axios({
        method: 'put',
        url: `/roles/${id}`,
        data
      })
    } catch (error) {
      throw error
    }
  },
  async deleteRole({ commit }, id) {
    try {
      await this.$axios({
        method: 'delete',
        url: `/roles/${id}`
      })
    } catch (error) {
      throw error
    }
  },
};
