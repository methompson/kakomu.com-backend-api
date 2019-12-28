<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link v-if="loggedIn" to="/about">Account</router-link> |
      <a v-if="loggedIn" href="#" @click="logOut">Log Out</a>
      <router-link v-else to="/login">Log In</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  computed: {
    authPayload(){
      return this.$store.state.authPayload;
    },
    loggedIn(){
      return this.$loggedIn();
    },
  },
  watch: {
    authPayload(){
      this.$store.dispatch("checkAuthToken")
        .then((result) => {
        });
    },
  },
  methods: {
    logOut(e){
      e.preventDefault();
      this.$store.dispatch("logUserOut");
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
