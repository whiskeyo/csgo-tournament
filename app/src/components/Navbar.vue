<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark ">
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
          <li class="nav-item">
            <router-link class="nav-link" to="/team">Team</router-link>
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
          <!-- <router-link class="" to="/">
            <button @click="signInWithGoogle" class="btn btn-success me-2">
              Sign In
            </button>
          </router-link> -->
          <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <button
              class="nav-link dropdown-toggle btn btn-success"
              style="height: 33.5px;"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
            >
              Sign In
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li>
                <div class="dropdown-item">
                  <label for="signInEmail" class="form-label">Email address</label>
                  <input v-model="signIn.email" type="email" class="form-control" id="signInEmail" aria-describedby="emailHelp">
                </div>
              </li>
              <li>
                <div class="dropdown-item">
                  <label for="signInPassword" class="form-label">Password</label>
                  <input v-model="signIn.password" type="password" class="form-control" id="signInPassword">
                </div>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a class="dropdown-item" @click="signInWithEmail" href="#">Confirm</a>
              </li>
            </ul>
          </li>
        </ul>
        <router-link v-if="this.$store.state.$isGoogleSignInEnabled" class="" to="/">
          <button @click="signInWithGoogle" class="btn btn-success me-2">
            Sign In With Google
          </button>
        </router-link>
        </form>
        <form v-else>
          <!-- <img v-bind:src="this.$store.state.$user?.photoURL" height="30" width="30"> -->
          {{ this.$store.state.$user?.nickname }} {{ "(" + this.$store.state.$user?.email + ")" }}
          <button @click="signOut" class="btn btn-success me-2">
            Sign Out
          </button>
        </form>
        <ul class="navbar-nav margin-left-5px" v-if="!shouldDisplayLogin">
          <li class="nav-item dropdown">
            <button
              class="nav-link dropdown-toggle btn btn-success"
              style="height: 33.5px;"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
            >
              Sign Up
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li>
                <div class="dropdown-item">
                  <label for="signUpEmail" class="form-label">Email address</label>
                  <input v-model="signUp.email" type="email" class="form-control" id="signUpEmail">
                </div>
              </li>
              <li>
                <div class="dropdown-item">
                  <label for="signUpFullname" class="form-label">Full name</label>
                  <input v-model="signUp.fullname" type="text" class="form-control" id="signUpFullname">
                </div>
              </li>
              <li>
                <div class="dropdown-item">
                  <label for="signUpNickname" class="form-label">Nickname</label>
                  <input v-model="signUp.nickname" type="text" class="form-control" id="signUpNickname">
                </div>
              </li>
              <li>
                <div class="dropdown-item">
                  <label for="signUpPassword" class="form-label">Password</label>
                  <input v-model="signUp.password" type="password" class="form-control" id="signUpPassword">
                </div>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a class="dropdown-item" @click="signUpWithEmailAndPassword" href="#">Confirm</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { app } from "../configs/firebase";
import { getAuth,
         GoogleAuthProvider,
         signInWithPopup,
         signOut,
         createUserWithEmailAndPassword,
         signInWithEmailAndPassword } from "firebase/auth";
import { db } from '../configs/db';
import { addDoc, getDocs, query, where, collection } from "firebase/firestore";

export default {
  name: 'Navbar',
  data() {
    return {
      auth: getAuth(app),
      isSignUpClicked: false,
      signIn: {
        email: "",
        password: ""
      },
      signUp: {
        email: "",
        password: "",
        fullname: "",
        nickname: ""
      },
    };
  },
  methods: {
    signInWithEmail: function() {
      this.auth = getAuth(app);

      signInWithEmailAndPassword(this.auth, this.signIn.email, this.signIn.password).then(async () => {
        this.$store.commit('setLoggedIn', {user: await this.getUserFromDbOnSignIn()});
        this.clearSignInForm();
      }).catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
    },
    signInWithGoogle: function() {
      this.auth = getAuth(app);
      const provider = new GoogleAuthProvider();

      signInWithPopup(this.auth, provider).then(() => {
        // this.$store.commit('setLoggedIn', {user: this.getUserFromDbOnSignIn()});
        console.log(this.auth);
      }).catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
    },
    signOut: function() {
      this.auth = getAuth(app);
      signOut(this.auth).then(() => {
        console.log("Logged out successfully");
        this.$store.commit('setLoggedOff');
      }).catch((error) => {
        console.log(error);
      });
    },
    signUpWithEmailAndPassword: function() {
      this.auth = getAuth(app);
      createUserWithEmailAndPassword(this.auth, this.signUp.email, this.signUp.password)
        .then(() => {
          console.log("Successfully signed up");
          this.createUserInDbOnSignUp();
          this.clearSignUpForm();
        })
        .catch((error) => {
          console.log("Error while signing up: ", error.code, error.message);
        });
    },
    createUserInDbOnSignUp: async function() {
      try {
        const docRef = await addDoc(collection(db, "users"), {
          uid: this.auth.currentUser.uid,
          nickname: this.signUp.nickname,
          fullname: this.signUp.fullname,
          email: this.signUp.email
        });
        console.log("User ", this.signUp.nickname, " added with ID ", docRef.id, "uid: ", this.auth.currentUser.uid);
      } catch (err) {
        console.log("Error while adding a user: ", err);
      }
    },
    getUserFromDbOnSignIn: async function() {
      console.log("getUserFromDbOnSignIn", this.auth.currentUser.uid);
      const user = query(collection(db, "users"), where("uid", "==", this.auth.currentUser.uid));
      const userSnapshot = await getDocs(user);
      console.log("userSnapshot", userSnapshot);
      const userData = userSnapshot.docs[0].data();
      return {
        nickname: userData.nickname,
        fullname: userData.fullname,
        email: userData.email,
        uid: userData.uid
      }
    },
    clearSignUpForm: function() {
      this.signUp.email = "";
      this.signUp.password = "";
      this.signUp.fullname = "";
      this.signUp.nickname = "";
    },
    clearSignInForm: function() {
      this.signIn.email = "";
      this.signIn.password = "";
    }
  },
  computed: {
    shouldDisplayLogin() {
      return this.$store.state.$isLoggedIn;
    }
  }
}
</script>

<style scoped>
.dropdown-menu-end {
  min-width: 500px;
}

.margin-left-5px {
    margin-left: 5px;
}

.margin-right-5px {
    margin-right: 5px;
}
</style>
