<template>
	<view>
		<ListCard :item="item" v-for="item in articleList" :key="item._id"></ListCard>
		<view class="no-data" v-if="!articleList.length">没有发布文章</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				articleList:[]
			}
		},
		onLoad(){
			this._getMyArticle();
		},
		methods: {
			async _getMyArticle(){
				const {data} = await this.$http.get_my_article({
					user_id:this.userInfo._id
				})
				this.articleList = data;
			}
		}
	}
</script>

<style lang="scss" scoped>
.no-data{
	height: 400rpx;
	line-height: 400rpx;
	width: 100%;
	text-align: center;
	font-size: 24rpx;
	color: #666;
}
</style>
