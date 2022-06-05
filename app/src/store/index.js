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
    },
    actions: {},
    modules: {},
    plugins: [createPersistedState()]
});