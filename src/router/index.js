import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Novelty from '../components/Timeline/Novelty.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/email',
        name: 'Email',
        component: () => import( /* webpackChunkName: "about" */ '../components/EdgeCircle.vue')
    },
    {
        path: '/novelty',
        name: 'Novelty',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../components/Timeline/Novelty.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                selector: to.hash
            }
        } else if (savedPosition) {
            return savedPosition;
        } else {
            return {
                x: 0,
                y: 0
            }
        }
    }
})

export default router