<template>
  <div>
    <PostEditor
      v-if="postLoaded"
      :title="post.title"
      :content="post.content"
      :tags="post.tags"
      @transmitPost="transmitPost" />
  </div>
</template>

<script>
import PostEditor from "../components/PostEditor.vue";

export default {
  components: {
    PostEditor,
  },
  data(){
    return {
      postLoaded: false,
      slug: '',
      post: {
        id: -1,
        title: "",
        author: "",
        slug: "",
        datePublished: 0,
        content: "",
        tags: "",
      },
    };
  },
  mounted(){
    this.$checkAuthAndRedirect();

    if ('slug' in this.$route.params){
      this.slug = this.$route.params.slug;
      this.getPost();
    }
  },
  methods: {
    getPost(){
      this.$store.dispatch('getPostBySlugAdmin', {
        slug: this.slug,
      })
        .then((result) => {
          this.post = result;
          this.postLoaded = true;
        });
    },
    transmitPost(post){
      const updatedPost = {
        ...post,
        id: this.post.id,
      };
      
      return this.$store.dispatch('transmitEditPost', {
        post: updatedPost,
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

</style>