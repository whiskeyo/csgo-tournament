import { createRouter, createWebHistory } from 'vue-router'

// import store from '../store'

import Home from '../views/Home.vue'
import About from '../views/About.vue'

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
  }
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory(""),
  routes
})

router.beforeEach((to) => {
  document.title = to.name || "CSGO Tournament";
});

export default router