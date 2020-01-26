<template>
  <div>
    <div class="title">{{ post.title }}</div>
    <div class="publishDateTime">
      {{ publishDateString }}
    </div>
    <div
      class="postContent mdOutput"
      v-html="renderedContent"></div>

      <router-link
        v-if="loggedIn"
        :to="'/edit-post/' + this.post.slug">
        Edit This Post
      </router-link>

      <!-- <a v-if="loggedIn"
        href="#"
        @click="deletePost">
        Delete This Post
      </a> -->
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';

export default {
  data(){
    return {
      slug: '',
      md: null,
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
    loggedIn(){
      return this.$checkAuthData();
    },
  },
  watch: {
    // $route(to, from){
    $route(){
      if ('slug' in this.$route.params){
        this.slug = this.$route.params.slug;
        this.getPost();
      }
    },
  },
  mounted(){
    // We get the slug from the route parameter
    // TODO Reroute to a 404 error if the slug wasn't included
    this.md = new MarkdownIt();

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
          if (!('id' in result)){
            return this.$router.replace({
              path: '/',
            });
          }
          this.post = result;
          return true;
        })
        .catch((err) => {
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
.title {
  color: #ff3e3e;
  font-weight: 700;
  font-size: 1.75em;
}

.buttonHolder {
  display: flex;
  justify-content: space-between;
}

a {
  color: #ff3e3e;
}

.publishDateTime{
  font-size: 0.8em;
  color: #999;
}
</style>