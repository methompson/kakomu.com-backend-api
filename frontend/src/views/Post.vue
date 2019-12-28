<template>
  <div>{{slug}}</div>
</template>

<script>
export default {
  data(){
    return {
      slug: '',
    };
  },
  watch: {
    // $route(to, from){
    $route(){
      if ('slug' in this.$route.params){
        this.slug = this.$route.params.slug;
      }
    },
  },
  mounted(){
    // We get the slug from the route parameter
    // TODO Reroute to a 404 error if the slug wasn't included
    if ('slug' in this.$route.params){
      this.slug = this.$route.params.slug;
    }
  },
};
</script>

<style lang="scss" scoped>

</style>