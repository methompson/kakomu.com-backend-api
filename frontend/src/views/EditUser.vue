<template>
  <div>

    <h1>Edit Your Information</h1>

    <div>
      First Name
      <input type="text" />
    </div>

    <div>
      Last Name
      <input type="text" />
    </div>

    <div>
      Current Password
      <input type="password" />
    </div>
    <div>
      New Password
      <input type="password" />
    </div>
    <div>
      Confirm New Password
      <input type="password" />
    </div>

  </div>
</template>

<script>
export default {
  mounted(){
    this.$checkAuthAndRedirect();
  },
};
</script>

<style lang="scss" scoped>

</style>