<template>
  <div>
    <Nuxt />
    <Spinkit v-if="showLoading" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      showLoading: true
    };
  },
  mounted() {
    window.timerSpin2 = setTimeout(() => {
      this.showLoading = false;
      clearTimeout(window.timerSpin2);
    }, 300);
  }
};
</script>
