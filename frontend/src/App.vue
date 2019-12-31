<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <span v-if="loggedIn">
        <router-link to="/account">Account</router-link> |
        <router-link to="/add-post">Add Post</router-link> |
      </span>
      <a v-if="loggedIn" href="#" @click="logOut">Log Out</a>
      <router-link v-else to="/login">Log In</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  mounted(){
    const token = window.localStorage.getItem('authToken');
    if (token){
      this.$store.dispatch("insertAuthToken", {
        token,
      })
        .then(() => {
          return this.$store.dispatch("checkAuthToken");
        });
    }
  },
  computed: {
    authPayload(){
      return this.$store.state.authPayload;
    },
    loggedIn(){
      return this.$checkAuthData();
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
    logOut(ev){
      ev.preventDefault();
      this.$store.dispatch("logUserOut")
        .then(() => {
          // Redirect the user to the home page.
          this.$router.replace({
            path: "/",
          });
        });
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  text-align: center;
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
