<template>
	<view class="nav-bar-container">
		<view class="nav-bar-top">
			<!-- 垫片。处理我们的app以及小程序的导航栏 -->
			<!-- 注意点,style是动态绑定的，别忘记 ： -->
			<view :style="{height: statusHeight + 'rpx'}"></view>

			<!-- 当组件作为搜索界面的时候，展示回退按钮 -->
			<view class="return-icon" v-if="isSearch" style="{top:statusHeight + 'rpx'}" @click="returnArticleList">
				<uni-icons type="back" size="22" color="#fff"></uni-icons>
			</view>
			<view @click="goSearchPage" class="nav-bar-content"
				:style="{marginRight:marginright + 'rpx',marginLeft:isSearch ? '20rpx' : 0}">
				<!-- 搜索小图标 -->
				<uni-icons type="search" color="#999"></uni-icons>
				<!-- 搜索框文字 -->
				<view class="nav-bar-search-txt" v-if="!isSearch">输入文章标题进行搜索</view>
				<input v-model.trim="searchVal" type="text" class="search-input" v-else placeholder="输入文章标题进行搜索" confirm-type="search" @confirm="changeInput">
			</view>
		</view>
		<!-- 垫片 撑开一个高度 80=搜索框的高度 + 下边距；把固定定位的搜索区域空出来-->
		<view :style="{height: statusHeight + 80 + 'rpx'}"></view>
	</view>
</template>

<script>
	export default {
		name: "NavBar", // 方便我们的devtools进行内容查找，这是name的其中一个功能。
		props: {
			isSearch: {
				type: Boolean,
				default: false
			},
			parentVal:String
		},
		data() {
			return {
				// 下边距为20rpx，所以默认上边距也为20rpx。由于小程序有系统自带的状态栏，所以还需要加上状态栏的高度。
				statusHeight: 20,
				marginright: 0 // 胶囊按钮的宽度，h5中没有，默认为0
			};
		},
		created() {
			this.initSystemInfo();
		},
		methods: {
			initSystemInfo() {
				const {
					statusBarHeight, // 状态栏高度，单位是px，需要转化为rpx
					windowWidth // 屏幕宽度
				} = uni.getSystemInfoSync(); //获取系统信息同步接口
				// 根据屏幕宽度设置比例系数
				const NUM = 750 / windowWidth;
				// 小程序中上边距设置为0（需要把状态栏的高度留出来），h5中上边距等于下边距。
				statusBarHeight && (this.statusHeight = statusBarHeight * NUM)
				//  uni.getMenuButtonBoundingClientRect()  小程序平台，如果原生导航栏被隐藏，仍然在右上角会有一个悬浮按钮，微信下也被称为胶囊按钮
				// 本api用于获取小程序下该菜单按钮的布局位置信息。
				// #ifdef MP-WEIXIN
				// 得到的top的单位为px，需要转化为rpx
				const {
					top,
					width
				} = uni.getMenuButtonBoundingClientRect();
				this.statusHeight = top * NUM; // 胶囊按钮距离顶边的距离
				this.marginright = width * NUM; // 胶囊按钮的宽度
				// #endif
			},
			// 跳转到搜索界面
			goSearchPage() {
				if (this.isSearch) return;
				uni.navigateTo({
					url: "../../pages/search/search"
				})
			},
			// 返回文章列表
			returnArticleList() {
				// #ifdef H5
				uni.switchTab({
					url: "../../pages/index/index"
				})
				// #endif
				// #ifndef H5
				uni.navigateBack()
				// #endif
			},
			// 通知父组件进行数据的查询
			changeInput(){
				this.$emit("sendSearchData")
			}
		},
		computed:{
			searchVal:{
				get(){
					return this.parentVal;
				},
				set(val){
					this.$emit('updateVal',val)
					if(!val){
						this.$emit('sendSearchData')
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './css/NavBar.scss'
</style>
