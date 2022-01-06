import {
	mapState,
	mapMutations
} from 'vuex'
export default {
	install(Vue) {
		Vue.mixin({
			data() {
				return {

				}
			},
			methods: {
				checkedisLogin() {
					return new Promise(resolve=>{
						if(this.userInfo){
							resolve()
						}else{
							// 没有用户信息就跳转到登陆页。
							uni.navigateTo({
								url:'/pages/userInfo/login/login',
							})
						}
					})
				},
				...mapMutations(['updateUserInfo'])
			},
			computed:{
				// 获取用户信息
				...mapState(['userInfo'])
			}
		})
	}
}
