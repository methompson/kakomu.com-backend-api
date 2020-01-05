<template>
  <div>
    <h1>Account</h1>

    <div class="accountInfo">
      <div>Account Info</div>
      <div>First Name: {{ userInfo.firstName }}</div>
      <div>Last Name: {{ userInfo.lastName }}</div>
      <div>Email: {{ userInfo.email }}</div>
    </div>

    <div>
      <div>
        <router-link
          to="/admin-post-list">
          Post List
        </router-link>
      </div>
      
      <div>
        <router-link
          to="/edit-account">
          Edit Your Account
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted(){
    console.log(this.userInfo);
    this.$checkAuthAndRedirect();
  },
  computed: {
    userInfo(){
      return this.$store.state.authPayload;
    },
  },
};
</script>

<style lang="scss" scoped>
  .accountInfo{
    margin: 1em 0;
  }
</style>