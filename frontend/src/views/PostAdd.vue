<template>
  <PostEditor
    @transmitPost="transmitPost"/>
</template>

<script>
import PostEditor from "../components/PostEditor.vue";

export default {  
  components: {
    PostEditor,
  },
  mounted(){
    this.$checkAuthAndRedirect();
  },
  methods: {
    transmitPost(post){
      return this.$store.dispatch('transmitNewPost', {
        post,
      })
        .then((res) => {
          // Redirect the user to the newly made post
          if ('id' in res.post && 'slug' in res.post){
            return this.$router.push({
              path: '/post/' + res.post.slug,
            });
          }

          return true;
        })
        .catch((err) => {
          // Display the error
        });
    },
  },
};
</script>

<style lang="scss" scoped>

.overLabel {
  display: block;
}

.contentArea {
  width: 80%;
  max-width: 800px;
  height: 10em;
}

</style>