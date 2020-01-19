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
    <div class="view">
      <router-view/>
    </div>

    <Button @click="msg">Test</Button>

    <MessageContainer />
  </div>
</template>

<script>
import MessageContainer from './components/MessageContainer.vue';

export default {
  components: {
    MessageContainer,
  },
  mounted(){
    const token = window.localStorage.getItem('authToken');
    if (token){
      this.$store.dispatch("insertAuthTokenFromStore", {
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
    msg(){
      const msg = "Test Message";

      this.$store.dispatch("addMessage", {
        message: msg,
      });
    },
    logOut(ev){
      ev.preventDefault();
      this.$store.dispatch("logUserOut")
        .then(() => {
          if (this.$router.currentRoute.path !== "/"){
            // Redirect the user to the home page.
            return this.$router.replace({
              path: "/",
            });
          }

          return true;
        })
        .catch((err) => {
          console.log("Error Logging Out", err);
        });
    },
  },
};
</script>

<style lang="scss">

body {
  padding: 0;
  margin: 0;
}

.view {
  margin: 1em;
}

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
