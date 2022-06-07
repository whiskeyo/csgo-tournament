<template>
  <div>
    <h1>Welcome on {{ this.$store.state.$appName }}</h1>
    <img :src="this.$store.state.$appLogoURL" alt="CStrikers logo">
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {

    }
  },

}
</script>

<style scoped>
h1, img {
  text-align: center;
}


</style>
