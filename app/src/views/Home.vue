<template>
  <div>
    <img class="mt-5 mb-3 mx-auto d-block" :src="this.$store.state.$appLogoURL" alt="CStrikers logo" width="200" />
    <div class="row">
      <div class="col-2"></div>
      <div class="col-8 display-6 text-center">
        We bring the quality for organising tournaments by everyone, for free. <br />
        Create an account, invite your friends, create tournaments and have fun!
      </div>
      <div class="col-2"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>
