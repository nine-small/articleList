// router.js
import {RouterMount,createRouter} from 'uni-simple-router';
import store from './store/index.js'
const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,  
	routes: [...ROUTES]
});
// 由于meta属性不好使，换数组进行验证
const isTrue = [
	'/pages/follow/follow',
	'/pages/myArticle/myArticle',
	'/pages/feedback/feedback'
]

//全局路由前置守卫
router.beforeEach((to, from, next) => {
	// 判断是否需要登陆，是否已经登陆 store.state.userInfo
	// console.log(to) to.meta没有内容
	// to.meta && to.meta.needLogin && 
	if(isTrue.includes(to.path) && !store.state.userInfo){
		next({
			"name":"Login",
			NAVTYPE:"push" // 跳转到普通界面，重新开启的界面保留历史记录栈
		})
	}else{
		next();
	}
});
// 全局路由后置守卫
router.afterEach((to, from) => {
    console.log('跳转结束')
})

export {
	router,
	RouterMount
}