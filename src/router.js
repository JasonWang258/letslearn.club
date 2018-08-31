import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import firebase from 'firebase/app'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
    },
    {
      path: '/chart',
      name: 'chart',
      component: () => import(/* webpackChunkName: "chart" */ '@/views/Chart.vue')
    },
    {
      path: '/resume',
      name: 'resume',
      component: () => import(/* webpackChunkName: "resume" */ '@/views/Resume.vue')
    },
    {
      path: '/p/:post_id',
      name: 'post_view',
      component: () => import(/* webpackChunkName: "resume" */ '@/views/ViewPost.vue')
    },
    {
      path: '/user',
      component: () => import(/* webpackChunkName: "user" */ '@/views/User.vue'),
      children: [
        {
          path: '',
          name: 'user',
          redirect: 'setting'
        },
        {
          path: 'setting',
          name: 'setting',
          component: () => import(/* webpackChunkName: "user" */ '@/views/Setting.vue'),
          meta: {
            requiresAuth: true,
            roles: ['boss', 'user']
          }
        },
        {
          path: 'login',
          name: 'login',
          component: () => import(/* webpackChunkName: "user" */ '@/views/Login.vue'),
          meta: {
            roles: 'guestOnly'
          }
        },
        {
          path: 'signup',
          component: () => import(/* webpackChunkName: "user" */ '@/views/Signup.vue'),
          meta: {
            roles: 'guestOnly'
          }
        },
        {
          path: 'password_reset',
          component: () => import(/* webpackChunkName: "user" */ '@/views/PasswordReset.vue'),
          meta: {
            roles: 'guestOnly'
          }
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const guestOnly = to.meta.roles === 'guestOnly'
  if (requiresAuth && !currentUser) {
    next('/user/login')
  } else if (requiresAuth && currentUser) {
    next()
  } else if (guestOnly && currentUser) {
    next('/user/setting')
  } else {
    next()
  }
})
export default router
