<template>
  <div
    class="messagePosition hidden"
    id="messagePosition">

    <div class="messageContainer">
      {{ currentMessage }}
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  mounted(){
    this.positionEl = document.getElementById("messagePosition");
  },
  computed: {
    ...mapState(['message']),
    elHeight(){
      return this.positionEl.offsetHeight;
    },
  },
  watch: {
    message(newVal, oldVal){
      console.log("Watching", newVal, oldVal);
      if (newVal === ""){
        this.hideMessage();
      } else if (newVal !== "" && oldVal === ""){
        console.log("Empty");
        this.showMessage(newVal);
      } else {
      }
    },
  },
  data(){
    return {
      currentMessage: "",
      positionEl: null,
    };
  },
  methods: {
    showMessage(newVal){
      // Remove the transition-duration, set the top to the current height, inverted
      // then remove hidden. We set a timeout to make sure that all CSS is set, then
      // we add animation and set top back to 0. This makes the message slide out.
      this.positionEl.classList.remove("animated");
      this.positionEl.classList.add("hidden");

      this.currentMessage = newVal;

      this.$nextTick(() => {
        this.positionEl.style.top = `${(-1 * this.elHeight)}px`;
        setTimeout(() => {
          this.positionEl.classList.remove("hidden");
          this.positionEl.classList.add("animated");
          this.positionEl.style.top = 0;
        }, 5);
      });
    },
    hideMessage(){
      this.positionEl.style.top = `${(-1 * this.elHeight)}px`;

      // Current text transition is set to 0.5 seconds, or 500 ms. I round to 
      // 550ms to make sure it transition fine.
      setTimeout(() => {
        this.currentMessage = "";
        this.positionEl.classList.add("hidden");
      }, 550);
    },
  },
};
</script>

<style lang="scss" scoped>

  .messagePosition {
    position: fixed;
    top: 0;
    width: 100%;
    text-align: center;
    padding-top: 1em;
  }

  .animated {
    transition-duration: 0.5s;
  }

  .hidden {
    opacity: 0;
  }

  .messageContainer {
    background-color: #9900d0;
    color: white;
    border-radius: 0.3em;
    font-weight: 700;
    font-size: 1.3em;
    display: inline-block;
    padding: 0.5em;
  }

</style>