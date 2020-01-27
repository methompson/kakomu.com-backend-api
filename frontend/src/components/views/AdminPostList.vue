<template>
  <div>
    <div>Admin Post List</div>

    <div
      class="postList">

      <table>
        <thead>
          <th>Id</th>
          <th>title</th>
          <th>Snippet</th>
          <th>Date Published</th>
          <th>Edit</th>
          <th>Delete</th>
        </thead>
        <tr v-for="(post, index) in posts" :key="post + index">
          <td>{{ post.id }}</td>
          <td><router-link :to="'/post/'+post.slug">{{ post.title }}</router-link></td>
          <td></td>
          <td v-if="post.published">{{ post.datePublished }}</td>
          <td v-else>Unpublished</td>
          <td class="actionLink" @click="editPost(post.slug)">Edit</td>
          <td class="actionLink" @click="deletePost(post.id)">Delete</td>
        </tr>
      </table>

    </div>
  </div>
</template>

<script>
export default {
  mounted(){
    this.$checkAuthAndRedirect();

    return this.getFullPostList();
  },
  data(){
    return {
      posts: [],
    };
  },
  methods: {
    getFullPostList(){
      return this.$store.dispatch("getFullPostList")
        .then((res) => {
          this.posts = res;
        })
        .catch((err) => {
          // Do something with the error
          this.$store.dispatch("addMessage", {
            message: err,
            type: "error",
          });
        });
    },
    deletePost(id){
      return this.$store.dispatch("deletePost", {
        id
      })
        .then((res) => {
          return this.getFullPostList();
        })
        .catch((err) => {
          this.$store.dispatch("addMessage", {
            message: err,
            type: "error",
          });
        });
    },
    editPost(slug){
      return this.$router.push({
        path: '/edit-post/' + slug,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .actionLink {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
  }
</style>