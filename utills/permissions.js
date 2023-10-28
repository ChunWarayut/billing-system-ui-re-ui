const hasPermission = (permCode) => {
    if (typeof window !== 'undefined') {
        const vuexLocal = window.localStorage.getItem("vuex")
        const parsedStore = JSON.parse(vuexLocal);
        if(!parsedStore || (parsedStore && !parsedStore.auth)) return false
        const parsedPermissions = parsedStore.auth.permissions;
        if (!parsedPermissions) return false
        let hasAccess = parsedPermissions.indexOf(permCode)
        if(hasAccess > -1){
          return true
        }else{
          return false
        }
    }
}


  module.exports = {
    hasPermission
};