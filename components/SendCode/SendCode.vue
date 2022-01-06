<template>
	<view class="code-container">
		<view class="vCode-btn" @click="getForm">
			{{runTime ? "获取验证码" : time+"秒后重新获取"}}
		</view>
	</view>
</template>

<script>
	export default {
		name: "SendCode",
		data() {
			return {
				timeId: null,
				runTime:true,
				time:60
			}
		},
		methods: {
			getForm() {
				// 获取form表单 => phone 单独的进行验证
				this.$emit("getForm", this._sendCode)
			},
			async _sendCode(form) {
				// 防止开启多个计时器。
				if(!this.runTime) return;
				try {
					const {
						phone
					} = await form.validateField(['phone'])
					// 定时器创建
					this.runTime && this.timeRunning();
					// 发送数据到后端，请求获取验证码
					const {msg,mobilCode} = await this.$http.get_code({phone})
					uni.showToast({
						icon:"none",
						title:msg
					})
					this.$emit("setCurrentCode",mobilCode)
				} catch (e) {
					//TODO handle the exception
					console.log("手机号格式验证失败")
				}
			},
			timeRunning(){
				this.runTime = false;
				this.timeId = setInterval(()=>{
					this.time--;
					if(this.time === 0){
						clearInterval(this.timeId);
						this.runTime = true;
						this.time = 60;
					}
				},1000)
			}
		},
		beforeDestroy(){
			// 组件销毁的时候，清除定时器
			clearInterval(this.timeId);
			this.timeId = null;
			this.runTime = true;
			this.time = 60;
		}
	}
</script>

<style lang="scss" scoped>
	.code-container {
		flex-shrink: 0;
		margin-right: 20rpx;

		.vCode-btn {
			background-color: $base-color;
			color: #FFFFFF;
			padding: 20rpx;
			border-radius: 10rpx;
			opacity: .8;
		}
	}
</style>
