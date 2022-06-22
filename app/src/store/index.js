import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

/**
 * Store holding global state in the application.
 * @module
 * @return {Store} Global store for the Vue application
 */
export default createStore({
  state: {
    $appName: "CStrikers",
    $appLogoURL: "https://i.imgur.com/k5Ns72R.png",
    $isLoggedIn: false,
    $shouldDisplayVueComponents: false,
    $user: null,
  },
  mutations: {
    setLoggedIn(state, { user }) {
      state.$isLoggedIn = true;
      state.$user = user;
    },
    setLoggedOff(state) {
      state.$isLoggedIn = false;
      state.$user = null;
    },
  },
  actions: {},
  modules: {},
  plugins: [createPersistedState()],
});
