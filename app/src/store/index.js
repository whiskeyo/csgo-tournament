import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    $appName: "CStrikers",
    $appLogoURL: "https://i.imgur.com/k5Ns72R.png",
    $isLoggedIn: false,
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
