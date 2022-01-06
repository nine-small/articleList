<template>
	<view class="login-container">
		<image src="../../../static/img/login_bg.png" class="banner-bg"></image>
		<!-- 选择登陆方式 -->
		<view class="login-nav">
			<view class="nav-item" :class="{active:type==='account'}" @click="changeLoginType('account')">
				账号登陆
			</view>
			<div class="nav-item" :class="{active:type==='phone'}" @click="changeLoginType('phone')">
				手机登陆
			</div>
		</view>
		<!-- 表单部分 -->
		<uni-forms class="form" ref="form" :modelValue="formData">
			<view class="" v-if="type === 'account'">
				<uni-forms-item label="账号" name="loginName">
					<input type="text" v-model="formData.loginName" placeholder-class="placeholder" class="form-input"
						placeholder="请输入账号" />
				</uni-forms-item>
				<uni-forms-item label="密码" name="password">
					<uni-easyinput :inputBorder="false" type="password" v-model="formData.password"
						placeholder-class="placeholder" class="form-input" placeholder="请输入密码"></uni-easyinput>
				</uni-forms-item>
			</view>
			<view class="" v-if="type === 'phone'">
				<uni-forms-item label="手机" name="phone">
					<input type="text" v-model="formData.phone" placeholder-class="placeholder" class="form-input"
						placeholder="请输入手机号" />
				</uni-forms-item>
				<uni-forms-item label="验证码" name="vCode">
					<input type="text" v-model="formData.vCode" placeholder-class="placeholder" class="form-input"
						placeholder="请输入验证码" />
					<SendCode @getForm="getForm" @setCurrentCode="setCurrentCode"></SendCode>
				</uni-forms-item>
			</view>
			<button class="login-btn" @click="_userLoginSubmit">立即登陆</button>
		</uni-forms>
		<view class="footer-select-container">
			<text>注册</text>
			<text>忘记密码</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					loginName: '',
					password: '',
					phone: '',
					vCode: ''
				},
				type: 'account',
				returnCode: null
			};
		},
		// 页面首次渲染完成执行的生命周期函数
		onReady() {
			// 由于小程序会过滤掉form表单的中的验证规则，所以我们需要手动的添加规则。
			this.$refs.form.setRules(this.userRules)
		},
		methods: {
			changeLoginType(type) {
				if (this.type === type) return;
				this.type = type;
				this.$refs.form.clearValidate([])
			},
			async _userLoginSubmit() {
				try {
					const resp = await this.$refs.form.validate([])
					// 发送数据到后端 ,根据type值查看是什么方式登陆
					this._sendUserInfo({
						...resp,
						type: this.type
					})
				} catch (e) {
					console.log('表单验证未通过')
				}
			},
			async _sendUserInfo(data) {
				const userInfo = await this.$http.user_login(data)
				if (userInfo) {
					// 登陆成功后把值存起来
					this.updateUserInfo(userInfo)
					// 登陆成功后弹出一个提示框
					uni.showToast({
						title: "用户登陆成功",
						icon: "none"
					});
					// 成功登陆后返回到原来的界面
					setTimeout(() => {
						// #ifdef H5
						uni.navigateBack()
						// #endif
						// #ifndef H5
						uni.switchTab({
							url: '/pages/index/index'
						})
						// #endif
					}, 1500)
				}
			},
			// 向SendCode组件发送form表单。
			getForm(callback) {
				typeof callback === 'function' && callback(this.$refs.form)
			},
			setCurrentCode(currentCode) {
				this.returnCode = currentCode;
			}
		},
	}
</script>

<style>
	page {
		background-color: #F5F5F5;
	}
</style>

<style lang="scss" scoped>
	@import './css/login.scss'
</style>
