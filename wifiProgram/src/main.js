// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'

import zrender from 'zrender'
Vue.use(zrender)

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import VueCookie from "vue-cookie"
Vue.use(VueCookie)


import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
Vue.prototype.$zrender = zrender

Vue.config.productionTip = false
Vue.prototype.role = null
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
