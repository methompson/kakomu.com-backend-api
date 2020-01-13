<template>
  <div>

    <h1>Edit Your Information</h1>

    <div>
      First Name
      <input v-model="newFirstName" type="text" />
    </div>

    <div>
      Last Name
      <input v-model="newLastName" type="text" />
    </div>

    <div>
      <button @click="updateUserAccountInfo">Update User Account</button>
    </div>

    <div>
      Current Password
      <input v-model="currentPass" type="password" />
    </div>
    <div>
      New Password
      <input v-model="newPass" type="password" />
    </div>
    <div>
      Confirm New Password
      <input v-model="newPassConf" type="password" />
    </div>

    <div>
      <button @click="updateUserPassword">Update User Password</button>
    </div>

  </div>
</template>

<script>
export default {
  mounted(){
    this.$checkAuthAndRedirect();
  },
  data() {
    return {
      newFirstName: "",
      newLastName: "",
      currentPass: "",
      newPass: "",
      newPassConf: "",
    };
  },
  methods: {
    updateUserAccountInfo(){
      this.$store.dispatch("updateUserInfo", {
        firstName: this.newFirstName,
        lastName: this.newLastName,
        password: this.currentPass,
      })
        .then((res) => {
          console.log(res);
          // Do something with result
        });
    },
    updateUserPassword(){
      // Check if the new passwords are the same
      if ( this.newPass !== this.newPassConf){
        // do something
        console.log("Not the same");
        return;
      }

      if (this.newPass.length < 8){
        console.log("Password Too Short");
        return;
      }

      this.$store.dispatch("updateUserPassword", {
        password: this.currentPass,
        newPassword: this.newPass,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>