import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";

export default createStore({
    state: {
        $appName: "CStrikers",
        $isLoggedIn: false,
        $username: "void wczesniejszy"
    },
    mutations: {
        setLoggedIn(state, { username }) {
            state.$isLoggedIn = true;
            state.$username = username;
        },
        setLoggedOff(state) {
            state.$isLoggedIn = false;
            state.$username = "pustka";
        }
        // setToken(state, token) {
        //     state.token = token;
        //     state.isAuthenticated = true;
        // },
        // removeToken(state) {
        //     state.token = '';
        //     state.isAuthenticated = false;
        // }
    },
    actions: {},
    modules: {},
    plugins: [createPersistedState()]
});