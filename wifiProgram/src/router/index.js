import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Main'
import routerUpload from '@/pages/routerUpload'
import routerModified from '@/pages/routerModified'
import routerEdit from '@/pages/routerEdit'
import login from '@/pages/login'
import routerPreview from '@/pages/routerPreview'

Vue.use(Router)

export default new Router({
	routes: [
		{
                  path: '/',
                  name: 'main',
                  component: Main,
                  meta: {
                  keepAlive: false // 不需要被缓存
                  }
		}, {
                  path: '/login',
                  name: 'login',
                  component: login
		}, {
                  path: '/routerUpload',
                  name: 'routerUpload',
                  component: routerUpload,
		}, {
                  path: '/routerModified',
                  name: 'routerModified',
                  component: routerModified,
		}, , {
                  path: '/routerPreview',
                  name: 'routerPreview',
                  component: routerPreview,
		}, {
                  path: '/routerEdit',
                  name: 'routerEdit',
                  component: routerEdit,
                  meta: {
                        keepAlive: false // 不需要被缓存
                  }
		}
	]

})
