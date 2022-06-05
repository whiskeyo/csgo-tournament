<template>
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
          Logged in: {{ this.$store.state.$isLoggedIn }}
        </form>
        <form class="d-flex">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-success me-2">Search</button>
        </form>
        <form v-if="!shouldDisplayLogin" class="d-flex">
          <router-link class="" to="/">
            <button @click="signInWithGoogle" class="btn btn-success me-2">
              Login
            </button>
          </router-link>
        </form>
        <form v-else>
          User logged: {{ this.$store.state.$username }}
          <button @click="signOut" class="btn btn-success me-2">
            Log out
          </button>
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
import { app } from "../configs/firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

export default {
  name: 'Navbar',
  data() {
    return {
      auth: getAuth(app),
    };
  },
  methods: {
    signInWithGoogle: function() {
      this.auth = getAuth(app);
      const provider = new GoogleAuthProvider();

      signInWithPopup(this.auth, provider).then(() => {
        this.$store.commit('setLoggedIn', {username: this.auth.currentUser.displayName});
        console.log(this.auth);
      }).catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
    },
    signOut: function() {
      this.auth = getAuth(app);
      signOut(this.auth).then(() => {
        console.log("Looged out successfully");
        this.$store.commit('setLoggedOff');
        // Successfully signed out
      }).catch((error) => {
        // Error
        console.log(error);
      });
    },
  },
  computed: {
    shouldDisplayLogin() {
      return this.$store.state.$isLoggedIn;
    }
  }
}
</script>

<style scoped>

</style>
