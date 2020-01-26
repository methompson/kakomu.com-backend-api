<template>
<div class="blogListItem">
  <div class="title">
      <router-link
        :to="'/post/'+this.post.slug">
        {{ post.title }}
      </router-link>
  </div>
  <div class="publishDateTime">
    {{ publishDateString }}
  </div>
  <div
    class="mdOutput"
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
          datePublished: "2019-01-01T00:00:00.000Z",
          published: false,
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
    renderedContent(){
      if (!this.md){
        return "";
      }

      return this.md.render(this.post.content);
    },
    publishDateString(){
      if (this.post.published === false){
        return "No Published";
      }
      const d = new Date(this.post.datePublished);

      return `Published On ${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
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
.title {
  a {
    border-bottom: 1px solid transparent;
    text-decoration: none;
    color: #ff3e3e;
    transition-duration: 200ms;
    font-weight: 700;
    font-size: 1.75em;
  }

  a:hover {
    border-bottom: 1px solid #110148;
  }
}

.publishDateTime{
  font-size: 0.8em;
  color: #999;
}

.blogListItem {
  border-bottom: 1px solid #DDD;
  margin-bottom: 1em;
}
</style>