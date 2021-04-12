import Vue from 'vue'
import Router from 'vue-router'
import Manager from '@/views/Manager'
import Login from '@/views/Login'
import Register from '@/views/Register'
import Doctor from '@/views/Doctor'
import Patient from '@/views/Patient'
import Header from '@/views/Header'
import Index from '@/views/Index'
import Contact from '@/views/Contact'
import Departments from '@/views/Departments'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [{
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
    },{
      path:'/header',
      name:"Header",
      component: Header
    },{
    path:'/',
    name:"Index",
    component: Index
    },{
    path:'/contact',
    name:"Contact",
    component: Contact
    },{
    path:'/departments',
    name:"Departments",
    component: Departments
    }
  ]
})
