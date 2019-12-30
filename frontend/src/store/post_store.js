const mutations = {};

const actions = {
  getPostBySlug(context, payload){
    if (!('slug' in payload)){
      return {};
    }
    const url = context.state.restUrl + "/api/blog/" + payload.slug;

    return fetch(url)
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

  transmitPost(context, payload){
    return new Promise((resolve, reject) => {

      if (!('post' in payload) || typeof payload.post !== typeof {}){
        reject();
        return;
      }

      if ( !('authToken' in context.state) || context.state.authToken.length === 0){
        reject();
        return;
      }

      console.log(context.state.authToken);

      const url = context.state.restUrl + '/api/admin/add';

      console.log(payload.post);

      fetch(url, {
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
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
};

export {
  mutations,
  actions,
};