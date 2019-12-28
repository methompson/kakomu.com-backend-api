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
  <div>
    {{ post.content }}
  </div>
</div>

</template>

<script>
export default {
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
  computed: {
    defaultPost(){
      if ('default' in this.post && this.post.default === true){
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>