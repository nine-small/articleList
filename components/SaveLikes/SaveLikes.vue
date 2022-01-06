<template>
	<!-- stop阻止事件冒泡 -->
	<view class="save-icons" @click.stop="_changeSaveStatus"> 
		<uni-icons color="#ff6600" :type="isSave" size="20"></uni-icons>
	</view>
</template>

<script>
	export default {
		name:"SaveLikes",
		props:['articleId'],
		methods:{
			async _changeSaveStatus(){
				// 判断用户是否登陆
				await this.checkedisLogin()
				// 登陆了就改变当前收藏状态
				const {msg,newUserInfo} = await this.$http.update_save_likes({
					articleId:this.articleId,
					userId:this.userInfo._id
				})
				uni.showToast({
					icon:'none',
					title:msg
				})
				// 更新数据（store）
				this.updateUserInfo(newUserInfo)
				uni.$emit('updateArticle')
			},
		},
		computed:{
			isSave(){
				if(this.userInfo && this.userInfo.article_likes_ids.includes(this.articleId)){
					return 'heart-filled'
				}else{
					return 'heart'
				}
			}
		}
	}
</script>

<style lang="scss">

</style>
