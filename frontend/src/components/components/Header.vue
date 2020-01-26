<template>
  <div id="nav">
    <b-navbar toggleable="sm" type="dark" variant="kak-blue">
      <b-navbar-brand to="/">
        <img
          src="@/assets/images/K-logo.png"
          class="d-inline-block align-center header-img"
          alt="Kakomu">
        Kakomu's Blog
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/about">About</b-nav-item>

          <b-nav-item v-if="loggedIn" to="/account">Account</b-nav-item>
          <b-nav-item v-if="loggedIn" to="/add-post">Add a Post</b-nav-item>

          <b-nav-item v-if="loggedIn" @click="logOut">Log Out</b-nav-item>
          <b-nav-item v-else to="/login">Login</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
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

.header-img {
  max-height: 2em;
}

</style>