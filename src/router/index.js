import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/views/index'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/index',
      name: 'HelloWorld',
      component: HelloWorld
    },{
      path:'/home',
      name:'Home',
      component:Home
    }
  ]
})
