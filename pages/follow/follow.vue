<template>
	<view class="follow-container">
		<view class="follow-tab">
			<view class="follow-tab-box">
				<view class="follow-tab-item" :class="{active:currentIndex === 0}" @click="currentIndex=0">文章</view>
				<view class="follow-tab-item" :class="{active:currentIndex === 1}" @click="currentIndex=1">作者</view>
			</view>
		</view>
		<!-- 内容区 -->
		<view class="follow-list-container">
			<!-- currrent 当前显示那个 -->
			<swiper class="follow-list-swiper" :current="currentIndex" @change="currentIndex = $event.detail.current">
				<swiper-item>
					<!-- 文章列表组件 -->
					<ListItem v-if="articleList.length" :articleList="articleList" :isShowLoadMore="false"></ListItem>
					<view v-else class="no-data">暂无收藏的文章</view>
				</swiper-item>
				<swiper-item>
					<AuthorList :authorList="authorList" v-if="authorList.length"></AuthorList>
					<view v-else class="no-data">暂无喜欢的作者</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			// #ifdef MP-WEIXIN
			if (!this.userInfo) {
				this.$Router.replace({
					"name": "Login"
				})
			}
			// #endif
			uni.$on('updateArticle', () => {
				this._getFollowArticle(true)
			})
			uni.$on('updateAuthor',()=>{
				this._getAuthorList(true);
				this.currentIndex = 1;
			})
			this._getFollowArticle();
			this._getAuthorList();
		},
		data() {
			return {
				currentIndex: 0,
				articleList: [],
				authorList: []
			}
		},
		methods: {
			// 获取收藏的文章
			async _getFollowArticle(isLoading) {
				const {
					// msg,
					data
				} = await this.$http.get_follow_article({
					user_id: this.userInfo._id,
					isLoading
				})
				// uni.showToast({
				// 	icon: "none",
				// 	title: msg
				// })
				this.articleList = data;
			},
			// 获取收藏的作者列表
			async _getAuthorList(isLoading){
				const {
					data
				} = await this.$http.get_follow_author({
					user_id: this.userInfo._id,
					isLoading
				})
				this.authorList = data;
			}
		}
	}
</script>

<style lang="scss">
	@import './css/follow.scss'
</style>
