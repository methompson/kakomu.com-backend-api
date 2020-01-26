<template>
  <div>
    <div v-for="(post, index) in blogPosts" :key="index" >
      <BlogListItem
        :post="post"
        :id="'post' + index" />
    </div>
  </div>
</template>

<script>
import BlogListItem from './BlogListItem.vue';

export default {
  components: {
    BlogListItem,
  },
  data(){
    return {
      blogPosts: [],
    };
  },
  mounted(){
    this.$store.dispatch('getPagePostList')
      .then((res) => {
        this.blogPosts = res;
      });
  },
};
</script>

<style lang="scss" scoped>

</style>