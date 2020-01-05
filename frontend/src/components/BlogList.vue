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
    fetch("http://localhost:3000/api/blog")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.blogPosts = res;
      });
  },
};
</script>

<style lang="scss" scoped>

</style>