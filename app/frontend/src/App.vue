<template>
  <div id="wrapper">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">{{ this.$store.state.$appName }}</a>
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
            <li class="nav-item dropdown">
              <router-link
                class="nav-link dropdown-toggle"
                to="/tournament"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Tournaments
              </router-link>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item" href="#">Something else here</a>
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/tournament"
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
            <router-link class="" to="/signup">
              <button class="btn btn-success me-2">
                Login
              </button>
            </router-link>
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
      <span>{{ this.$store.state.$appName }} - 2022 © All rights reserved</span>
    </footer>
  </div>
</template>

<script>
import "bootstrap";

export default {
  name: "App",
  data() {
    return {

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
