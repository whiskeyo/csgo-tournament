<template>
  <div id="wrapper">
    <Navbar/>

    <section class="section">
      <div class="container">
        <!-- <p>User logged: {{ auth.currentUser?.displayName }}, UID: {{ auth.currentUser?.uid }}</p>
        <button @click="signOut" class="btn btn-success me-2">
          Log out
        </button> -->
        <router-view />
      </div>
    </section>

    <Footer/>
  </div>
</template>

<script>
import "bootstrap";
import Navbar from "./components/Navbar.vue"
import Footer from "./components/Footer.vue"
// import { app } from "./configs/firebase";
// import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

export default {
  name: "App",
  components: {
    Navbar,
    Footer
  },
  // data() {
  //   return {
  //     auth: getAuth(),
  //   };
  // },
  // methods: {
  //   signInWithGoogle: function() {
  //     this.auth = getAuth(app);
  //     const provider = new GoogleAuthProvider();

  //     signInWithPopup(this.auth, provider).catch((error) => {
  //       console.log(error.code);
  //       console.log(error.message);
  //     });
  //   },
  //   signOut: function() {
  //     this.auth = getAuth(app);
  //     signOut(this.auth).then(() => {
  //       console.log("Looged out successfully");
  //       // Successfully signed out
  //     }).catch((error) => {
  //       // Error
  //       console.log(error);
  //     });
  //   }
  // },
  // mounted: function() {
  //   this.auth = getAuth(app);
  // }
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
