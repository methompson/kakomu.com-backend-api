import uuidv4 from "uuid/v4";

const mutations = {
  addMessage(state, data){
    state.messages = {
      ...state.messages,
    };
    state.messages[data.id] = data.message;
  },

  removeMessage(state, data){
    const messages = {
      ...state.messages,
    };

    delete messages[data.id];

    state.messages = messages;
  },
};

const actions = {
  addMessage(context, payload){
    return new Promise((resolve, reject) => {
      if ( !("message" in payload) ){
        reject();
        return;
      }

      resolve();
    })
      .then(() => {
        const id = uuidv4();

        let message;
        if (typeof payload.message === typeof "string"){
          message = payload.message;
        } else if (payload.message instanceof Error) {
          message = payload.message.message;
        }

        let type = "notice";
        let timeout = 10000;
        if ("timeout" in payload){
          timeout = payload.timeout;
        }

        if ("type" in payload){
          type = payload.type;
        }

        context.commit("addMessage", {
          message: {
            message,
            type,
            timeout,
          },
          id,
        });
      });
  },

  removeMessage(context, payload){
    return new Promise((resolve, reject) => {
      if ( !("id" in payload) ){
        reject();
        return;
      }

      resolve();
    })
      .then(() => {
        context.commit("removeMessage", {
          id: payload.id,
        });
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