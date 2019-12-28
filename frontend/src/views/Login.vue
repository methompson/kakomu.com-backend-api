<template>
  <div>
    <h1>Login</h1>

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
    sendLoginData(){
      this.$store.dispatch("logUserIn", {
        email: this.email,
        password: this.password,
      })
        .then((result) => {

          if (!result.success){
            this.errMsg = result.message;
            setTimeout(() => {
              this.errMsg = "";
            }, 10000);
            return;
          }

          this.$router.replace({
            path: "/",
          });
          const state = this.$store.state;

          console.log(state.authPayload);
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