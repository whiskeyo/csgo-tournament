<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img :src="this.$store.state.$appLogoURL" height="40" />
      </a>
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
            <div
              class="nav-link dropdown-toggle"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Teams
            </div>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li v-if="isSignedIn">
                <router-link to="/team/create" class="dropdown-item">Create a Team</router-link>
              </li>
              <li>
                <router-link to="/team/list" class="dropdown-item">List All Teams</router-link>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <div
              class="nav-link dropdown-toggle"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Tournaments
            </div>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li v-if="isSignedIn">
                <router-link class="dropdown-item" to="/tournament/create">Create a Tournament</router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/tournament/list">List of Tournaments</router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/tournament/maps">Maps</router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/tournament/matches">Matches</router-link>
              </li>
            </ul>
          </li>
        </ul>
        <form v-if="!isSignedIn" class="d-flex">
          <router-link class="" to="/">
            <button @click="signInWithGoogle" class="btn btn-light margin-left-5px">Sign In With Google</button>
          </router-link>
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <button
                class="dropdown-toggle btn btn-light margin-left-5px"
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
                    <input
                      v-model="signIn.email"
                      type="email"
                      class="form-control"
                      id="signInEmail"
                      aria-describedby="emailHelp"
                    />
                  </div>
                </li>
                <li>
                  <div class="dropdown-item">
                    <label for="signInPassword" class="form-label">Password</label>
                    <input v-model="signIn.password" type="password" class="form-control" id="signInPassword" />
                  </div>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a class="dropdown-item" @click="signInWithEmail" href="#">Confirm</a>
                </li>
              </ul>
            </li>
          </ul>
        </form>
        <form v-else>
          {{ this.$store.state.$user?.nickname }}
          {{ "(" + this.$store.state.$user?.email + ")" }}
          <button type="button" @click="signOut" class="btn btn-light margin-left-5px">Sign Out</button>
        </form>
        <ul class="navbar-nav margin-left-5px" v-if="!isSignedIn">
          <li class="nav-item dropdown">
            <button class="btn dropdown-toggle btn-light" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
              Sign Up
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li>
                <div class="dropdown-item">
                  <label for="signUpEmail" class="form-label">Email address</label>
                  <input v-model="signUp.email" type="email" class="form-control" id="signUpEmail" />
                </div>
              </li>
              <li>
                <div class="dropdown-item">
                  <label for="signUpFullname" class="form-label">Full name</label>
                  <input v-model="signUp.fullname" type="text" class="form-control" id="signUpFullname" />
                </div>
              </li>
              <li>
                <div class="dropdown-item">
                  <label for="signUpNickname" class="form-label">Nickname</label>
                  <input v-model="signUp.nickname" type="text" class="form-control" id="signUpNickname" />
                </div>
              </li>
              <li>
                <div class="dropdown-item">
                  <label for="signUpPassword" class="form-label">Password</label>
                  <input v-model="signUp.password" type="password" class="form-control" id="signUpPassword" />
                </div>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
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
import accountApi from "../api/accountApi";

/**
 * @vue-data {Object} [signIn={ email: "", password: "" }]
 *    Parameters used for signing-in with email and password
 * @vue-data {Object} [signUp={ email: "", password: "", fullname: "", nickname: "" }]
 *    Parameters used for signing-up, used by a function to create an account
 * @vue-event {void} signUpWithEmailAndPassword - Creates an account for a user with given parameters
 * @vue-event {void} signInWithEmail - Authenticates user for a email+password sign-in
 * @vue-event {void} signInWithGoogle - Authenticates user with a Google account on sign-in
 * @vue-event {void} signOut - Signs out the user
 * @vue-event {void} clearSignUpForm - Clears fields of signUp object
 * @vue-event {void} clearSignInForm - Clears fields of signIn object
 * @vue-computed {Boolean} isSignedIn - Checks if the user is signed-in based on the store state
 */
export default {
  name: "Navbar",
  data() {
    return {
      signIn: {
        email: "",
        password: "",
      },
      signUp: {
        email: "",
        password: "",
        fullname: "",
        nickname: "",
      },
    };
  },
  methods: {
    signUpWithEmailAndPassword: function () {
      if (
        accountApi.signUpWithEmailAndPassword(
          this.signUp.email,
          this.signUp.password,
          this.signUp.nickname,
          this.signUp.fullname
        )
      )
      this.clearSignUpForm();
    },
    signInWithEmail: function () {
      if (accountApi.signInWithEmail(this.signIn.email, this.signIn.password, this.$store)) this.clearSignInForm();
    },
    signInWithGoogle: function () {
      accountApi.signInWithGoogle(this.$store);
    },
    signOut: async function () {
      await accountApi.signOut(this.$store);
    },
    clearSignUpForm: function () {
      this.signUp.email = "";
      this.signUp.password = "";
      this.signUp.fullname = "";
      this.signUp.nickname = "";
    },
    clearSignInForm: function () {
      this.signIn.email = "";
      this.signIn.password = "";
    },
  },
  computed: {
    isSignedIn() {
      return this.$store.state.$isLoggedIn;
    }
  },
};
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

/* used for dropdown with not implemented components redirection */
.disabled-link {
  pointer-events: none;
}
</style>
