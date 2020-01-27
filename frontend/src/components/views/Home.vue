<template>
<div>
  <BlogList
    v-if="blogLoaded"
    :currentPage="currentPage"
    :blogPosts="blogPosts"
    :totalPosts="totalPosts" />
</div>
</template>

<script>
import BlogList from '../components/BlogList.vue';

export default {
  components: {
    BlogList,
  },
  computed: {
    currentPage(){
      if ('page' in this.$route.params){
        return parseInt(this.$route.params.page, 10);
      }

      return 1;
    },
  },
  watch: {
    currentPage(newVal){
      this.getPostsForPage();
    }
  },
  data(){
    return {
      blogLoaded: false,
      blogPosts: [],
      totalPosts: 0,
    };
  },
  mounted(){
    this.getPostsForPage();
  },
  methods: {
    getPostsForPage(){
      this.blogLoaded = false;

      this.$store.dispatch('getPagePostList', {
        page: this.currentPage,
      })
        .then((res) => {
          this.blogPosts = res.posts;
          this.totalPosts = res.meta.totalPosts;
          this.blogLoaded = true;
        });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>