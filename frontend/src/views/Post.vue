<template>
  <div>
    <h1>{{ post.title }}</h1>
    <div>{{ post.content }}</div>
    
  </div>
</template>

<script>
export default {
  data(){
    return {
      slug: '',
      post: {
        title: "",
        author: "",
        slug: "",
        datePublished: 0,
        content: "",
        tags: "",
      },
    };
  },
  watch: {
    // $route(to, from){
    $route(){
      console.log("Changed");
      if ('slug' in this.$route.params){
        this.slug = this.$route.params.slug;
        this.getPost();
      }
    },
  },
  mounted(){
    // We get the slug from the route parameter
    // TODO Reroute to a 404 error if the slug wasn't included
    console.log("Mounted");
    if ('slug' in this.$route.params){
      this.slug = this.$route.params.slug;
      this.getPost();
    }
  },
  methods: {
    getPost(){
      this.$store.dispatch('getPostBySlug', {
        slug: this.slug,
      })
        .then((result) => {
          console.log("Finished Getting Post");
          console.log(result);
          this.post = result;
        });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>