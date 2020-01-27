<template>

  <div
    class="messagesContainer"
    id="messagesContainer" >

    <div
      v-for="(message) in displayedMessages"
      :key="'message_' + message.id">

      <Message
        :message="message"
        @dismissMessage="dismissMessage" />

    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';

import Message from "./Message.vue";

export default {
  components: {
    Message,
  },
  mounted(){
    this.findAdditions();
  },
  computed: {
    ...mapState(['messages']),
    elHeight(){
      return this.positionEl.offsetHeight;
    },
    displayedMessageKeys(){
      const keys = {};

      this.displayedMessages.forEach((msg) => {
        keys[msg.id] = msg;
      });

      return keys;
    },
  },
  watch: {
    messages(newVal, oldVal){
      this.findAdditions();
    },
  },
  data(){
    return {
      displayedMessages: [],
    };
  },
  methods: {
    findAdditions(){
      const additions = {};
      const subtractions = {};

      Object.keys(this.messages).forEach((key) => {
        if ( !(key in this.displayedMessageKeys) ){
          this.addMessage(key);
        }
      });
    },
    addMessage(id){
      this.displayedMessages.push({
        id,
        message: this.messages[id].message,
        timeout: this.messages[id].timeout,
        type: this.messages[id].type,
      });

      console.log(this.messages[id]);

      console.log(this.displayedMessages);
    },
    dismissMessage(payload){
      const messages = [];
      for (let x = 0, len = this.displayedMessages.length; x < len; ++x){
        if (payload.id !== this.displayedMessages[x].id){
          messages.push(this.displayedMessages[x]);
        }
      }

      this.displayedMessages = messages;
    },
  },
};
</script>

<style lang="scss" scoped>

.messagesContainer {
  position: fixed;
  top: 0;
  width: 100%;
  text-align: center;
  background-color: transparent;
  pointer-events: none;
  transition-duration: 350ms;
}

</style>