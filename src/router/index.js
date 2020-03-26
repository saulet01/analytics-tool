import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Novelty from '../components/Timeline/Novelty.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Novelty',
        component: Novelty
    },
    {
        path: '/email',
        name: 'Email',
        component: () => import( /* webpackChunkName: "about" */ '../components/EdgeCircle.vue')
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router