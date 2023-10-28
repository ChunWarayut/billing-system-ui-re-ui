export default function (data) {
    const { $axios, app, redirect, store } = data
    $axios.onRequest(async (config) => {  
        try {
            // const dataToken = JSON.parse(localStorage.getItem("vuex"))
            // let token = dataToken && dataToken.auth && dataToken.auth.accessToken
            if(store.state && store.state.auth && store.state.auth.accessToken){
                // config.headers['Authorization'] = `Bearer ${store.state.auth.accessToken}`;
                config.headers.common['Authorization'] = `Bearer ${store.state.auth.accessToken}`;
            }
        } catch (error) {
            console.log("Could not update token:", error)
        }
        return config
    })
    $axios.onError((error) => {
        const code = parseInt(error.response && error.response.status)
        if (code === 401) {
            localStorage.removeItem("vuex")
            redirect('/auth')
        }
    })
  }