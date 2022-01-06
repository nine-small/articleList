<template>
	<view>
		<uni-popup ref="popup" :mask-click="false" type="bottom">
			<!-- 内容区域 -->
			<view class="popup-wrapper">
				<view class="popup-header">
					<text class="popup-header-item" @click="closePopupMasker">取消</text>
					<text class="popup-header-item" @click="sendCommentData">发布</text>
				</view>
				<view class="popup-content">
					<textarea class="popup-content-textarea" v-model.trim="commentVal" placeholder="请输入评论内容" maxlength="300"/>
					<view class="popup-content-count">
						{{commentVal.length}}/300
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name:"CommentMasker",
		props:{
			showPopup:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				commentVal:''
			};
		},
		methods: {
			// 关闭
			closePopupMasker() {
				this.$emit('closePopupMasker',false)
			},
			// 发布
			sendCommentData(){
				if(!this.commentVal){
					uni.showToast({
						title:"请输入评论内容",
						icon:"none"
					})
					return
				}
				this.$emit("sendCommentData",this.commentVal,this.clearCommentVal)
			},
			// 成功发布后，清空输入框的内容
			clearCommentVal(){
				this.commentVal = '';
			}
		},
		watch:{
			showPopup(newVal){
				newVal ? this.$refs.popup.open() : this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss">
	.popup-wrapper{
		background-color: #FFFFFF;
		.popup-header{
			@include flex();
			font-size: 28rpx;
			color: #666;
			border-bottom: 1px solid #F5F5F5;
			.popup-header-item{
				height: 100rpx;
				line-height: 100rpx;
				padding:0 30rpx;
			}
		}
		.popup-content{
			width: 100%;
			padding:30rpx;
			box-sizing: border-box;
			.popup-content-textarea{
				height: 400rpx;
				width: 100%;
			}
			.popup-content-count{
				@include flex(flex-end);
				color: $c-9;
				font-size: 24rpx;
			}
		}
	}
</style>
