import { createRouter, createWebHistory } from 'vue-router'

import store from '../store'

import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Tournament from '../views/Tournament.vue'
import Team from '../views/Team.vue'
import CycleJsTest from '../views/CycleJsTest.vue'

const routes = [{
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
        path: '/tournament',
        name: 'Tournament',
        component: Tournament
    },
    {
        path: '/team',
        name: 'Team',
        component: Team
    },
    {
        path: '/cyclejstest',
        name: 'Cycle.js Test',
        component: CycleJsTest
    }
]

export const router = createRouter({
    history: createWebHistory(),
    mode: 'history',
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = "[" + store.state.$appName + "] " + to.name;
    next()
})



export default router