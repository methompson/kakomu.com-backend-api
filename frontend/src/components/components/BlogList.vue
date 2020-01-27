<template>
  <div v-if="blogPosts.length > 0">
    <div v-for="(post, index) in blogPosts" :key="index" >
      <BlogListItem
        :post="post"
        :id="'post' + index" />
    </div>
    <Pagination
      :totalPosts="totalPosts"
      :currentPage="currentPage"
      :postsPerPage="10"/>
  </div>
</template>

<script>
import BlogListItem from './BlogListItem.vue';
import Pagination from './Pagination.vue';

export default {
  components: {
    BlogListItem,
    Pagination,
  },
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    totalPosts: {
      type: Number,
      default: 0,
    },
    blogPosts: {
      type: Array,
      default(){
        return [];
      },
    },
  },
};
</script>

<style lang="scss" scoped>

</style>