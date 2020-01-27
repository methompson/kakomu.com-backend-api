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
      <div
        class="editBtn"
        @click="saveDraft">
        Save Draft
      </div>

      <br>

      <div
        class="editBtn"
        @click="publishDraft">
        Publish
      </div>

      <br>

      <div
        class="editBtn"
        v-if="post.id > 0"
        @click="deletePost">
        Delete This Post
      </div>
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

    this.newTitle = this.post.title;
    this.contentArea.value(this.post.content);
    this.newTags = this.post.tags;
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
    post: {
      type: Object,
      default(){
        return {
          id: -1,
          title: "",
          author: "",
          slug: "",
          datePublished: 0,
          content: "",
          tags: "",
        };
      },
    }
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
    async deletePost(){
      if (this.post.id < 0){
        return false;
      }

      return this.$store.dispatch("deletePost", {
        id: this.post.id,
      })
        .then((res) => {
          return this.$router.push({
            path: '/',
          });
        })
        .catch((err) => {
          // Handle the error
          this.$store.dispatch("addMessage", {
            message: err,
            type: "error",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.editBtn {
  display: inline-block;
  padding: 0.3em 0.6em;
  margin: 0.2em 0;
  background-color: #ff3e3e;
  border: 1px solid darken(#ff3e3e, 20%);
  color: white;
  border-radius: 0.4em;
  -webkit-box-shadow: 3px 2px 3px 0px rgba(0,0,0,0.5);
  box-shadow: 3px 2px 3px 0px rgba(0,0,0,0.5);
}
</style>