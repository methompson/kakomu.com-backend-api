<template>
  <div>
    <div class="fieldGroup">
      <label>Title:</label>
      <input
        type="text"
        name="title"
        v-model="newTitle" >
    </div>

    <div>
      <label class="overLabel">Type Your Post Here</label>
      <textarea
        id="contentArea"
        class="contentArea"
        name="content"
        v-model="newContent" />
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
        v-model="newTags" >
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

      <button
        @click="deletePost">
        Delete This Post
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

    this.newTitle = this.title;
    this.contentArea.value(this.content);
    this.newTags = this.tags;
  },
  computed: {
    contentPreview(){
      if (!this.contentArea){
        return "";
      }

      return this.md.render(this.contentArea.value());
    },
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    tags: {
      type: String,
      default: "",
    },
  },
  data(){
    return {
      contentArea: null,
      md: null,
      newTitle: "",
      newContent: "",
      newTags: "",
      published: null,
    };
  },
  methods: {
    assemblePostData(){
      return {
        title: this.newTitle,
        tags: this.newTags,
        content: this.contentArea.value(),
      };
    },
    saveDraft(){
      const post = this.assemblePostData();
      post.published = false;
      this.$emit('transmitPost', post);
    },
    publishDraft(){
      const post = this.assemblePostData();
      post.published = true;
      this.$emit('transmitPost', post);
    },
    deletePost(){
      // return this.$store.dispatch("deletePost", {
      //   id: this.post.id,
      // })
      //   .then((res) => {
      //     return this.$router.push({
      //       path: '/',
      //     });
      //   })
      //   .catch((err) => {
      //     // Handle the error
      //     this.$store.dispatch("addMessage", {
      //       message: err,
      //       type: "error",
      //     });
      //   });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>