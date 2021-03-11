import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Manager from '@/views/Manager'
import Login from '@/views/Login'
import Register from '@/views/Register'
import Doctor from '@/views/Doctor'
import Patient from '@/views/Patient'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path:'/',
      name:'Index',
      component:Index
    },{
      path:'/manager',
      name:"Manager",
      component: Manager
    },{
      path:'/login',
      name:"Login",
      component: Login
    },{
      path:'/register',
      name:"Register",
      component: Register
    },{
      path:'/patient',
      name:"Patient",
      component: Patient
    },{
      path:'/doctor',
      name:"Doctor",
      component: Doctor
    }
  ]
})
