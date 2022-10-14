<template>
  <div style="background-color: #f7f8fa;">
    <Header />
    <Nuxt/>
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
    window.timerSpin = setTimeout(() => {
      this.showLoading = false;
      clearTimeout(window.timerSpin);
    }, 300);
  }
};
</script>
