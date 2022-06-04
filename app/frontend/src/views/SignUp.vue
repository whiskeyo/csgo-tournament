<template>
  <div>
    <h1>Something on Sing Up</h1>
    <button @click="signInWithGoogle">Log in</button>
  </div>
</template>

<script>
import { app } from "../firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default {
  name: 'Sign Up',
  data() {
    return {

    }
  },

  methods: {
    signInWithGoogle: function() {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();

      signInWithPopup(auth, provider).catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
    }
  }
}
</script>

<style scoped>

</style>
