import jwtDecode from 'jwt-decode';

const mutations = {
  setAuthToken(state, data){
    if (!('token' in data)){
      return; 
    }

    state.authToken = data.token;
    state.authPayload = jwtDecode(data.token);

    console.log(jwtDecode(data.token));
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
        if ('token' in res){
          return context.dispatch("insertAuthToken", {
            token: res.token,
          })
            .then(() => {
              return {
                success: true,
              };
            });
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
    context.commit("removeAuthToken");
    window.localStorage.removeItem("authToken");
  },

  // This function inserts an authorization token into the store
  // and local storage.
  async insertAuthToken(context, payload){
    if ('token' in payload){
      context.commit("setAuthToken", {
        token: payload.token,
      });

      window.localStorage.setItem("authToken", payload.token);
      return;
    }

    throw new Error("Token Not Provided");
  },

  // We run this method when we have an auth token from the local storage
  // and we want to insert it into the store or we received a new auth
  insertAuthTokenFromStore(context, payload){
    if (!('token' in payload)){
      return;
    }

    context.commit("setAuthToken", {
      token: payload.token,
    });
  },

  checkAuthToken(context){
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