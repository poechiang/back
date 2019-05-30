// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import app from './app'
import router from './router'
import store from './store'
import http from './utils/http'
import echarts from 'echarts'
import eventer from './utils/eventer'
import VueResource from 'vue-resource'


import  VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import VueSocketIO from 'vue-socket.io'



router.beforeEach((to, from, next) => {
	
	//to即将进入的目标路由对象，from当前导航正要离开的路由， next  :  下一步执行的函数钩子
	if(to.meta.loginInspect!==false && !store.state.user) {
		//下一跳路由需要登录验证，并且还未登录，则路由定向到  登录路由

		next({  path:'login',params:{redir:to} })
	} 
	else { 
		next() 
	}
})


router.afterEach(to => {
	if (!store) {
		return
	}

	store.state.ui.header = to.meta.header!==false
	store.state.ui.aside = to.meta.aside!==false
	store.state.ui.view = to.meta.view!==false
	store.state.ui.catch = to.meta.catch!==false
	store.state.app = to.meta.app
	
	store.state.menu = to.meta.menu||0
	
	if(to.meta.tab){
		document.title = to.meta.tab
	}
})


Vue.config.productionTip = false


const config = require('../config')[process.env.NODE_ENV === 'production'?'build':'dev']

Vue.config.domain = config.domain
Vue.config.uploadServer = config.uploadServer

Vue.config.quillEditorModule = config.quillEditorModule

Vue.prototype.$http = http
Vue.prototype.$echarts = echarts
Vue.prototype.events = eventer
Vue.prototype.request = http.request
Vue.prototype.upload = http.upload

import kebabCase from 'lodash/kebabCase'
const requireComponent = require.context('./components/',false,/\w+\.(vue|js)$/)

requireComponent.keys().forEach(fn => {
	// 获取组件配置
	const conf = requireComponent(fn),
		cn = conf.default.name||kebabCase(fn.replace(/^\.\/(.*)\.\w+$/, '$1'))

	// 全局注册组件
	Vue.component(cn,conf.default || conf)
})


Vue.use(VueQuillEditor)

Vue.use(new VueSocketIO({
    debug: false,
    connection: 'wss://open.poechiang.tech/service',
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },
    options: { path: "/socketio/contact",autoConnect: false} //Optional options
}))


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { app },
  template: '<app/>'
})
