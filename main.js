import App from './App'
import Vue from 'vue'
import module from 'ajax/api/index.js'
import userRuleMixin from './common/rulesMixin.js'
import commonMixin from './common/commonMixin.js'
import store from './store/index.js'
import { router,RouterMount } from './router.js'

Vue.prototype.$http = module;

Vue.use(userRuleMixin)
Vue.use(commonMixin)
Vue.use(router)

Vue.config.productionTip = false

App.mpType = 'app'


const app = new Vue({
    ...App,
	store
})

// v1.3.5起，H5端 你应该去除原有的app.$moount();使用路由自带的渲染方式
// #ifdef H5
	RouterMount(app,router,"#app")
// #endif

// #ifndef H5
	app.$mount() // 为了兼容小程序及app端必须这样写才有效果
// #endif 

// app.$mount()

