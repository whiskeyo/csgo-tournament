<template>
  <div id="wrapper">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">{{ appname }}</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/torunament"
                >Tournament</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/about">About</router-link>
            </li>
          </ul>
          <form class="d-flex">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button class="btn btn-outline-success me-2">Search</button>
          </form>
          <form class="d-flex">
            <button class="btn btn-success me-2">Log In</button>
            <button class="btn btn-success me-2">Create Account</button>
          </form>
        </div>
      </div>
    </nav>

    <section class="section">
      <div class="container">
        <router-view />
      </div>
    </section>

    <footer class="bg-dark">
      <span>{{ appname }} - 2022 © All rights reserved</span>
    </footer>
  </div>
</template>

<script>
import "bootstrap";

export default {
  name: "App",
  data() {
    return {
      appname: "CStrikers",
    };
  },
};
</script>

<style lang="scss">
@import "~bootstrap/dist/css/bootstrap.min.css";
@import "./assets/css/styles.css";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  margin-bottom: 50px;
  padding-bottom: 10px;
}
</style>
