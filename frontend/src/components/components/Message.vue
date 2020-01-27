<template>
  <div
    :id="messageId"
    :class="messageClass"
    @click="dismiss">
    {{ message.message }}
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      default() {
        return {
          message: "",
          id: "",
          timeout: 10000,
          type: "notice",
        };
      },
    },
  },
  computed: {
    messageId(){
      return "message_" + this.message.id;
    },
    messageType(){
      if (this.message.type.toLowerCase() === 'error'){
        return 'error';
      }

      if (this.message.type.toLowerCase() === 'success'){
        return 'success';
      }

      return 'notice';
    },
    messageClass(){
      return `messageBox beforeAppear ${this.messageType}`;
    },
  },
  mounted(){
    setTimeout(() => {
      this.appear();
    }, 5);

    this.timeoutHandler = setTimeout(() => {
      this.dismiss();
    }, 10000);
  },
  data() {
    return {
      timeoutHandler: null,
    };
  },
  methods: {
    appear(){
      const el = document.getElementById(this.messageId);
      el.classList.remove("beforeAppear");
    },
    dismiss(){
      clearTimeout(this.timeoutHandler);
      const el = document.getElementById(this.messageId);
      el.classList.add("dismiss");

      this.$store.dispatch("removeMessage", {
        id: this.message.id,
      });

      setTimeout(() => {
        this.$emit("dismissMessage", {
          id: this.message.id,
        });
      }, 350);
    },
  },
};
</script>

<style lang="scss" scoped>
.messageBox {
  transition-duration: 350ms;
  color: white;
  display: inline-block;
  padding: 0.5em;
  margin-top: 0.5em;
  border-radius: 0.3em;
  font-weight: 700;
  font-size: 1.3em;
  pointer-events: auto;
}

.beforeAppear {
  margin-right: 3em;
  opacity: 0;
}

.error {
  background-color: #ff3e3e;
}

.success {
  background-color: #00ff7c;
  color: black;
}

.notice {
  background-color: purple;
}

.dismiss {
  margin-left: 3em;
  opacity: 0;
}
</style>