import axios from "axios";
import jwtDecode from "jwt-decode";
import qs from "qs";
class HttpClient {
  static async login(payload) {
    const { username, password } = payload
    try {
      const response = await axios.post(
        `${window.$nuxt.context.$config.API_BASE_URL}/login`,
        {
          username,
          password,
        }
      );
      const user = jwtDecode(response.data.token);
      const accessToken = response.data.token;

      return { user: user, accessToken };
    } catch (error) {
      return null;
    }
  }
  static async call({
    url,
    data,
    method,
    params,
    responseType = "json",
    contentType = "application/json",
  }) {
    let parsed_token = "";
    if (process.browser) {
      const vuexLocal = window.localStorage.getItem("vuex");
      if (vuexLocal) {
        const parsed_store = JSON.parse(vuexLocal);
        if (parsed_store && parsed_store.auth) {
          parsed_token = parsed_store.auth.accessToken;
        }
      }
    }
    let res;
    try {
      res = await this.$axios({
        baseURL: window.$nuxt.context.$config.API_BASE_URL,
        url,
        method,
        data,
        params,
        responseType,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
        headers: {
          "Content-Type": contentType,
          Authorization: `Bearer ${parsed_token}`,
        },
      });
      res = res.data;
    } catch (error) {
      console.log("error", error);
    }
    return res;
  }
  static async callWithRetryLoop({
    url,
    data,
    method,
    params,
    responseType = "json",
  }) {
    let parsed_token = "";
    if (process.browser) {
      const vuexLocal = window.localStorage.getItem("vuex");
      if (vuexLocal) {
        const parsed_store = JSON.parse(vuexLocal);
        if (parsed_store && parsed_store.auth) {
          parsed_token = parsed_store.auth.accessToken;
        }
      }
    }
    let tryAgain = true;
    let res;
    while (tryAgain === true) {
      tryAgain = false;
      try {
        res = await this.$axios({
          baseURL: window.$nuxt.context.$config.API_BASE_URL,
          url,
          method,
          data,
          params,
          responseType,
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parsed_token}`,
          },
        }).catch((err) => {
          if (
            (err.response && err.response.status === 503) ||
            err.message === "Network Error"
          ) {
            tryAgain = true;
            setTimeout(() => {
              console.log(
                `Received ${
                  err.response ? err.response.status : err.message
                } error. Attempting api call again...`
              );
            }, "100");
          } else {
            console.log("Axios catch: ", err.toJSON());
          }
        });
      } catch (err) {
        console.log("Try catch: ", err);
      }
      if (res) res = res.data;
    }
    return res;
  }

  static async callWithResponse({
    url,
    data,
    method,
    params,
    responseType = "json",
    contentType = "application/json",
  }) {
    let parsed_token = "";
    if (process.browser) {
      const vuexLocal = window.localStorage.getItem("vuex");
      if (vuexLocal) {
        const parsed_store = JSON.parse(vuexLocal);
        if (parsed_store && parsed_store.auth) {
          parsed_token = parsed_store.auth.accessToken;
        }
      }
    }
    let res;
    try {
      res = await this.$axios({
        baseURL: window.$nuxt.context.$config.API_BASE_URL,
        url,
        method,
        data,
        params,
        responseType,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
        headers: {
          "Content-Type": contentType,
          Authorization: `Bearer ${parsed_token}`,
        },
      });
      res = res.data;
    } catch (error) {
      if (
        error.request.responseType === "blob" &&
        error.response.data instanceof Blob &&
        error.response.data.type &&
        error.response.data.type.toLowerCase().indexOf("json") != -1
      ) {
        return new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.onload = () => {
            error.response.data = JSON.parse(reader.result);
            resolve(Promise.reject(error));
          };

          reader.onerror = () => {
            reject(error);
          };

          reader.readAsText(error.response.data);
        });
      }
      return Promise.reject(error);
    }
    return res;
  }

  // How to use .call
  // GET
  // await HttpClient.call({
  //   url: "/product",
  //   method: "GET",
  //   params: {
  //     page: params.page,
  //     sort: params.sort,
  //     limit: params.limit || 12,
  //   },
  // });

  // POST
  // await HttpClient.call({
  //   url: "/auditlogs",
  //   method: "POST",
  //   data: {
  //     uid,
  //     email,
  //     fullname,
  //     channel,
  //     access_token,
  //   },
  // });
}

export default HttpClient;
