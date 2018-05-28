import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Main'
import Marker from '@/pages/Marker'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },{
      path: '/marker',
      name: 'marker',
      component:Marker
    }

  ]
})
