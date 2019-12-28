import jwtDecode from 'jwt-decode';

const mutations = {
  setAuthToken(state, data){
    if (!('token' in data)){
      return; 
    }

    state.authToken = data.token;
    state.authPayload = jwtDecode(data.token);
  },

  removeAuthToken(state){
    state.authToken = "";
    state.authPayload = {};
  },
};

const actions = {
  logUserIn(context, payload){
    const url = context.state.restUrl + "/api/auth/login";
    const body = {
      email: payload.email,
      password: payload.password,
    };

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if ('token' in res){
          context.commit("setAuthToken", {
            token: res.token,
          });

          window.localStorage.setItem("authToken", res.token);
          return {
            success: true,
          };
        }

        return {
          success: false,
          message: res.message,
          error: res.error,
        };
      })
      .catch((err) => {
        console.log(err);
      });
  },

  logUserOut(context){
    console.log("Logging User Out");
    context.commit("removeAuthToken");
    window.localStorage.removeItem("authToken");
  },

  checkAuthToken(context, payload){
    if ( !('exp' in context.state.authPayload) ){
      return false;
    }

    const now = new Date();
    if (now.getTime() >= (context.state.authPayload.exp * 1000)){
      return context.dispatch('logUserOut')
        .then(() => {
          return false;
        });
    }

    return true;
  },
};

export {
  mutations,
  actions,
};