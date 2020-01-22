<template>
  <div id="app">
    <Header />
    <div class="view">
      <router-view/>
    </div>

    <Footer />

    <MessageContainer />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import MessageContainer from './components/MessageContainer.vue';

export default {
  components: {
    MessageContainer,
    Header,
    Footer,
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
  },
  watch: {
    authPayload(){
      this.$store.dispatch("checkAuthToken")
        .then((result) => {
        });
    },
  },
};
</script>

<style lang="scss" scoped>

.view {
  margin: 1em;
  flex-grow: 100;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

</style>
