import { createRouter, createWebHistory } from 'vue-router'

// import store from '../store'

import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Tournament from '../views/Tournament.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/torunament',
    name: 'Tournament',
    component: Tournament
  }
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  mode: 'history',
  history: createWebHistory(),
  routes,
  beforeEach(to){
    document.title = to.name || "CSGO Tournament";
  },
});



export default router