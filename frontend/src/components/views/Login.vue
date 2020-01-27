<template>
  <div>
    <h1>Login</h1>
    <form>
      <div>
        Email
        <input
          type="text"
          v-model="email"
          name="email" />
      </div>

      <div>
        Password
        <input
          type="password"
          v-model="password"
          name="password" />
      </div>
      <button
        @click="sendLoginData" >
        Log In
      </button>
     </form>
     <div
      :class="'errorMessage' + (errMsg.length > 0 ? '' : ' blank')">
      {{ errMsg }}
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      email: "",
      password: "",
      errMsg: "",
    };
  },
  methods: {
    sendLoginData(ev){
      ev.preventDefault();
      this.$store.dispatch("logUserIn", {
        email: this.email,
        password: this.password,
      })
        .then((result) => {

          if (!result.success){
            this.$store.dispatch("addMessage", {
              message: result.message,
              type: "error",
            });
            return;
          }

          this.$router.replace({
            path: "/",
          });
          const state = this.$store.state;
        })
        .catch((err) => {
          this.$store.dispatch("addMessage", {
            message: err,
            type: "error",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>

  .errorMessage {
    background-color: #ffd1d1;
    color: #ff0c0c;
    font-weight: 700;
    padding: 1em;
    font-size: 1.2em;
  }

  .blank {
    display: none;
  }

</style>