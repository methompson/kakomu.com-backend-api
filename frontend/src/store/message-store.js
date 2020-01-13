const mutations = {
  setMessage(state, data){
    console.log("Changing Message");
    console.log(data.message);
    state.message = data.message;
  },

  setTimeoutHandle(state, data){
    state.messageTimeoutHandle = data.messageTimeoutHandle;
  },
};

const actions = {
  addMessage(context, payload){
    if (context.state.messageTimeoutHandle !== null){
      clearTimeout(context.state.messageTimeoutHandle);
    }

    context.commit("setMessage", {
      message: payload.message,
    });

    const handle = setTimeout(() => {
      context.dispatch("removeMessage");
    }, 2000);

    context.commit("setTimeoutHandle", {
      messageTimeoutHandle: handle,
    });
  },

  removeMessage(context){
    context.commit("setMessage", {
      message: "",
    });

    context.commit("setTimeoutHandle", {
      messageTimeoutHandle: null,
    });
  },
};

const getters = {
  message(state) {
    return state.message;
  },
};

export {
  mutations,
  actions,
  getters,
};