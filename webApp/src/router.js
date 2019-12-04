import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Nothing from './views/Nothing.vue'
import PostComments from './views/PostComments.vue'
import FormLogin from './views/FormLogin.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      props: true
    },
    {
      path: '/nothing',
      name: 'nothing',
      component: Nothing
    },
    {
      path: '/activity',
      name: 'activity',
      props: true,
      component: PostComments,
      meta: { requiresAuth: true }
    },
    {
      path: '/form-login',
      name: 'formlogin',
      component: FormLogin,
      props: true
    }
  ]
})
