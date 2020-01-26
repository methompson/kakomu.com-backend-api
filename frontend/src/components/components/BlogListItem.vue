<template>
<div>
  <h1>
      <router-link
        v-if="!defaultPost"
        :to="'/post/'+this.post.slug">

        {{ post.title }}
      </router-link>
    <span
      v-else>
      {{ post.title }}
    </span>
  </h1>
  <div
    v-html="snippet">
  </div>
</div>

</template>

<script>
import MarkdownIt from 'markdown-it';

export default {
  mounted(){
    this.md = new MarkdownIt();
  },
  props: {
    post: {
      type: Object,
      default(){
        return {
          title: "Default Title",
          content: "No Content Here",
          slug: "default_title",
          default: true,
        };
      },
    },
  },
  data(){
    return {
      md: null,
    };
  },
  computed: {
    defaultPost(){
      if ('default' in this.post && this.post.default === true){
        return true;
      }
      return false;
    },
    renderedContent(){
      if (!this.md){
        return "";
      }

      return this.md.render(this.post.content);
    },
    snippet(){
      if (!this.md){
        return "";
      }

      // find the first paragraph mark
      const newLine = /\n/g;
      const index = this.post.content.search(newLine);

      // If there's no new lines, the snippet is the entire post
      // otherwise, it's up to the first paragraph.
      let snippet;
      if (index < 0){
        snippet = this.post.content;
      } else {
        snippet = this.post.content.substring(0, index);
      }

      return this.md.render(snippet);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>