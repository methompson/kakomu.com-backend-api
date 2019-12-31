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
    v-html="renderedContent">
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
      default: () => {
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
  },
};
</script>

<style lang="scss" scoped>

</style>