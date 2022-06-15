<template>
  <div id="wrapper">
    <div class="content">
      <Navbar />
      <section class="section">
        <div class="container">
          <router-view />
        </div>
      </section>
    </div>
    <Footer />
  </div>
</template>

<script>
import "bootstrap";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Navbar,
    Footer,
  },
};
</script>

<style lang="scss">
@import "~bootstrap/dist/css/bootstrap.min.css";
@import "./assets/css/styles.css";

.container {
  width: 1000px;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  margin-bottom: 50px;
  padding-bottom: 10px;
}
</style>
