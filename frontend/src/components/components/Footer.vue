<template>
  <footer>
    Copyright {{currentYear}}
  </footer>
</template>

<script>
export default {
  computed: {
    currentYear(){
      return new Date().getFullYear();
    },
  },
};
</script>

<style lang="scss" scoped>

footer {
  background-color: #110148;
  color: #ff3e3e;
  padding: 1em;
}

</style>