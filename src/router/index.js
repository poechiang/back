import Vue from 'vue'
import Router from 'vue-router'
import home from '@/pages/home'
Vue.use(Router)


import kebabCase from 'lodash/kebabCase'
const requireComponent = require.context('../pages',true,/\w+\.(vue)$/)
var routeList = []
requireComponent.keys().forEach(fn => {
	// 获取组件配置
	const comp = (requireComponent(fn)||{}).default
	var list = [],
		route = (comp||{}).route||{},
		path = route.path || fn.match(/^\.(.+)\.(vue)$/)[1]


	route.meta = $$.extend({
		loginInspect:false,//process.env.NODE_ENV === 'production',//true,
		app:'shibu',
		header:true,
		aside:true,
	},route.meta||{})
	
	if ($$.isArray(path)) {
		for(var i=0;i<path.length;i++){
			list.push($$.extend(true,{},route,{
				path:path[i],
				component:comp
			}))
		}
	}
	else{
		list.push($$.extend(true,{},route,{
			path:path,
			component:comp
		}))
	}

	routeList.push(...list)

})

export default new Router({
	mode: 'history',
	routes: routeList,

})


