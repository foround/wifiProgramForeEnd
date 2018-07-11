import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Main'
import routerUpload from '@/pages/routerUpload'
import routerModified from '@/pages/routerModified'
import routerEdit from '@/pages/routerEdit'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'main',
            component: Main,
            meta: {
                keepAlive: false // 需要被缓存
            }
		}, {
            path: '/routerUpload',
            name: 'routerUpload',
            component: routerUpload,
		}, {
            path: '/routerModified',
            name: 'routerModified',
            component: routerModified,
		}, {
            path: '/routerEdit',
            name: 'routerEdit',
            component: routerEdit,
		}
	]

})
