<template>
  <div class="paginationContainer">
    <span>
      <router-link
        v-if="!firstPage"
        :to="previousPage">
        Previous Page
      </router-link>
    </span>
    <span>
      <router-link
        v-if="!lastPage"
        :to="nextPage">
        Next Page
      </router-link>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    totalPosts: {
      type: Number,
      default: 0,
    },
    postsPerPage: {
      type: Number,
      default: 10,
    },
    currentPage: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    totalPages(){
      if (this.postsPerPage === 0){
        return 0;
      }
      return Math.ceil(this.totalPosts / this.postsPerPage);
    },
    lastPage(){
      if (this.currentPage === this.totalPages){
        return true;
      }

      return false;
    },
    firstPage(){
      if (this.currentPage === 1){
        return true;
      }

      return false;
    },
    previousPage(){
      if (this.currentPage === 2){
        return '/';
      }

      return `/page/${this.currentPage - 1}`;
    },
    nextPage(){
      return `/page/${this.currentPage + 1}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.paginationContainer {
  display: flex;
  justify-content: space-between;
  font-size: 0.8em;

  a {
    background-color: #ff3e3e;
    color: white;
    padding: 0.4em;
    border-radius: 0.3em;
  }
}
</style>