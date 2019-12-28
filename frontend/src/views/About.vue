<template>
  <div>
    About
  </div>
</template>

<script>
export default {
  props: {
    val: {
      type: String,
      default: "Default",
    },
  },
  mounted(){
    console.log(this.$route.params);
  },
};
</script>

<style lang="scss" scoped>

</style>