import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Nothing from './views/Nothing.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/nothing',
      name: 'nothing',
      component: Nothing
    }
  ]
})
