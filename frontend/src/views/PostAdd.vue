<template>
  <div>

    <div class="fieldGroup">
      <label>Title:</label>
      <input
        type="text"
        name="title"
        v-model="title" >
    </div>

    <div>
      <label class="overLabel">Type Your Post Here</label>
      <textarea
        name="content"
        v-model="content" />
    </div>

    <div class="fieldGroup">
      <label>Tags:</label>
      <input
        type="text"
        name="tags"
        v-model="tags" >
    </div>

    <div>
      <button
        @click="saveDraft">
        Save Draft
      </button>

      <button
        @click="publishDraft">
        Publish
      </button>
      
    </div>
  </div>
</template>

<script>
export default {
  mounted(){
    this.$checkAuthAndRedirect();
  },
  data(){
    return {
      title: "",
      content: "",
      tags: "",
      published: null,
    };
  },
  methods: {
    assemblePostData(){
      return {
        title: this.title,
        tags: this.tags,
        content: this.content,
      };
    },
    saveDraft(){
      const post = this.assemblePostData();
      post.published = false;
      this.transmitPost(post);
    },
    publishDraft(){
      const post = this.assemblePostData();
      post.published = true;
      this.transmitPost(post);
    },
    transmitPost(post){
      this.$store.dispatch('transmitPost', {
        post,
      })
        .then((res) => {
          // Redirect the user to the newly made post
          if ('id' in res && 'slug' in res){
            return this.$router.push({
              path: '/post/' + res.slug,
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

</style>