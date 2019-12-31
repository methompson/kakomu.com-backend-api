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
        id="contentArea"
        class="contentArea"
        name="content"
        v-model="content" />
    </div>

    <div
      v-if="contentPreview.length > 0"
      class="preview"
      id="contentPreview"
      v-html="contentPreview">
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
import SimpleMDE from "simplemde";
import {} from 'simplemde/dist/simplemde.min.css';
import MarkdownIt from 'markdown-it';

export default {
  mounted(){
    this.$checkAuthAndRedirect();

    this.md = new MarkdownIt();

    this.contentArea = new SimpleMDE({
      element: document.getElementById("contentArea"),
      toolbar: [
        "bold",
        "italic",
        "strikethrough",
        "|",
        "heading-smaller",
        "heading-bigger",
        "|",
        "code",
        "quote",
        "|",
        "horizontal-rule",
        "unordered-list",
        "ordered-list",
        "|",
        "clean-block",
        "link",
        "image",
        "table",
      ],
    });
  },
  computed: {
    contentPreview(){
      if (!this.contentArea){
        return "";
      }

      return this.md.render(this.contentArea.value());
    },
  },
  data(){
    return {
      contentArea: null,
      md: null,
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
        content: this.contentArea.value(),
      };
    },
    saveDraft(){
      const post = this.assemblePostData();
      post.published = false;
      console.log(post);
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

.contentArea {
  width: 80%;
  max-width: 800px;
  height: 10em;
}

</style>