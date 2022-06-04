import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// import { firestorePlugin } from 'vuefire'

axios.defaults.baseURL = 'http://localhost:8080'

createApp(App).use(store).use(router, axios).mount('#app')
    //use(firestorePlugin).