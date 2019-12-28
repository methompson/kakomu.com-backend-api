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
};

export {
  mutations,
  actions,
};