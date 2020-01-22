<template>
  <div id="nav">
    <span class="logoHolder">
      <router-link to="/">
        <img src="@/assets/images/K-logo.png" />
        <span class="subtitle">
          Kakomu's Blog
        </span>
      </router-link>
    </span>
    <span>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |

      <span v-if="loggedIn">
        <router-link to="/account">Account</router-link> |
        <router-link to="/add-post">Add Post</router-link> |
      </span>

      <a v-if="loggedIn" href="#" @click="logOut">Log Out</a>
      <router-link v-else to="/login">Log In</router-link>
    </span>
  </div>
</template>

<script>
export default {
  computed: {
    loggedIn(){
      return this.$checkAuthData();
    },
  },
  methods: {
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

<style lang="scss" scoped>
.logoHolder{
  display: flex;
  align-items: flex-end;

  a {
    text-decoration: none;
  }
}

.subtitle {
  color: #ff3e3e;
  font-size: 0.75em;
  padding-left: 0.5em;
}

#nav {
  text-align: center;
  padding: 30px;
  background-color: #110148;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  a {
    font-weight: bold;
    color: white;

    &.router-link-exact-active {
      color: #ff3e3e;
    }
  }
}

</style>