const mutations = {};

const updateItems = {
  firstName: {
    emptyOk: true,
    type: "string",
  },
  lastName: {
    emptyOk: true,
    type: "string",
  },
  email: {
    emptyOk: false,
    type: "string",
  },
};

const actions = {
  async updateUserInfo(context, payload){
    const body = {};

    Object.keys(updateItems).forEach((key) => {
      // We are checking if the key is in the payload
      // and if emptyOk is true or if it's false, if the payload
      // is not an empty string
      if ( key in payload
        && ( updateItems[key].emptyOk
          || (!updateItems[key].emptyOk && payload[key].length > 0)
        )
      ){
        body[key] = payload[key];
      }
    });

    if ('password' in payload){
      body.password = payload.password;
    }

    if (Object.keys(body).length <= 0){
      throw new Error("No Data Provided");
    }

    body.id = context.state.authPayload.userId;

    const url = context.state.restUrl + '/api/admin/update-user';
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + context.state.authToken,
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (res.ok){
          return res.json();
        }
        return res.json()
          .then((val) => {
            console.log(val);
            throw new Error("Update Not Successful");
          });
      })
      .then((res) => {
        console.log(res);
        return context.dispatch("insertAuthToken", {
          token: res.token,
        });
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  },

  async updateUserPassword(context, payload){
    if (!('password' in payload) || !('newPassword' in payload)){
      throw new Error("Data not provided");
    }

    const body = {
      id: context.state.authPayload.userId,
      password: payload.password,
      newPassword: payload.newPassword,
    };

    const url = context.state.restUrl + '/api/admin/change-password';
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + context.state.authToken,
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        const resp = res.json();
        if (res.ok){
          return resp;
        }

        return resp
          .then((val) => {
            console.log(val);
            throw new Error("Update Not Successful");
          });
      })
      .then((res) => {
        console.log(res);
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  },
};

export {
  mutations,
  actions,
};