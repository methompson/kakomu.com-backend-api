const mutations = {};

const actions = {
  getPostBySlug(context, payload){
    if (!('slug' in payload)){
      return {};
    }
    const url = context.state.restUrl + "/api/blog/" + payload.slug;

    return fetch(url)
      .then((res) => {
        if (!res.ok){
          return res.json()
            .then((errRes) => {
              throw new Error("Post Not Found " + res);
            });
        }
        return res.json();
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  },

  getPostBySlugAdmin(context, payload){
    if (!('slug' in payload)){
      return {};
    }

    const url = context.state.restUrl + "/api/admin/post/" + payload.slug;

    return fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + context.state.authToken,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  },

  transmitNewPost(context, payload){
    return new Promise((resolve, reject) => {
      if (!('post' in payload) || typeof payload.post !== typeof {}){
        return reject(new Error("Data not provided"));
      }

      if ( !('authToken' in context.state) || context.state.authToken.length === 0){
        return reject(new Error("No Authorization Token"));
      }

      const url = context.state.restUrl + '/api/admin/add';

      return resolve(context.dispatch("sendTransmission", {
        post: payload.post,
        url,
      }));
    });
  },

  transmitEditPost(context, payload){
    return new Promise((resolve, reject) => {
      if (!('post' in payload) || typeof payload.post !== typeof {}){
        return reject(new Error("Data not provided"));
      }

      if ( !('authToken' in context.state) || context.state.authToken.length === 0){
        return reject(new Error("No Authorization Token"));
      }

      const url = context.state.restUrl + '/api/admin/edit';

      return resolve(context.dispatch("sendTransmission", {
        post: payload.post,
        url,
      }));
    });
  },

  sendTransmission(context, payload){
    console.log(payload.url);
    return fetch(payload.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + context.state.authToken,
      },
      body: JSON.stringify(payload.post),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },

  deletePost(context, payload){
    return new Promise((resolve, reject) => {
      if (!('id' in payload)){
        return reject(new Error("Id Not Provided"));
      }

      if (payload.id < 1){
        return reject(new Error("Incorrect Id Provided"));
      }

      if ( !('authToken' in context.state) || context.state.authToken.length === 0){
        return reject(new Error("No Authorization Token"));
      }

      return resolve();
    })
      .then(() => {
        const url = context.state.restUrl + '/api/admin/delete';

        return fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + context.state.authToken,
          },
          body: JSON.stringify({
            id: payload.id,
          }),
        });
      })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },

  getFullPostList(context){
    return new Promise((resolve, reject) => {
      if ( !('authToken' in context.state) || context.state.authToken.length === 0){
        return reject(new Error("No Authorization Token"));
      }

      resolve();
      return true;
    })
      .then(() => {
        const url = context.state.restUrl + '/api/admin/list';

        return fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + context.state.authToken,
          },
        });
      })
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
};

export {
  mutations,
  actions,
};