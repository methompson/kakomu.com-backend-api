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
        
        let type = "notice";
        let timeout = 10000;
        if ("timeout" in payload){
          timeout = payload.timeout;
        }

        if ("type" in payload){
          type = payload.type;
        }

        const message = {
          message: payload.message,
          id,
          timeout,
          type,
        };

        context.commit("addMessage", {
          message: payload.message,
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