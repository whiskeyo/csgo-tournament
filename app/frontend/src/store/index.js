import { createStore } from 'vuex'

export default createStore({
  state: {
    $appName: "CStrikers",
    isAuthenticated: false,
    token: '',
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      state.isAuthenticated = true;
    },
    removeToken(state) {
      state.token = '';
      state.isAuthenticated = false;
    }
  },
  actions: {},
  modules: {}
})
