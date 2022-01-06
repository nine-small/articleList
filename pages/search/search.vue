<template>
	<view class="search-container">
		<NavBar :isSearch="true" @sendSearchData="_sendSearchData" :parentVal="parentVal" @updateVal="parentVal=$event">
		</NavBar>
		<!-- 搜索容器 -->
		<view class="search-wrapper" v-if="isShowHistory">
			<!-- 没有进行搜索操作的界面 -->
			<view class="search-history-container">
				<!-- 头部 -->
				<view class="search-header">
					<text class="history-text">搜索历史</text>
					<text class="history-clear" @click="clearHistory">清空</text>
				</view>
				<!-- 内容部分 -->
				<view class="search-history-content" v-if='historyList.length'>
					<view @click="openHistory(item)" class="history-content-item" v-for="(item,index) in historyList" :key="index">
						{{item}}
					</view>
				</view>
				<!-- 没有内容 -->
				<view class="no-data" v-else>
					当前没有搜索历史
				</view>
			</view>
		</view>
		<!-- 进行搜索操作的界面 -->
		<view class="search-list-container" v-else>
			<ListItem :isShowLoadMore="isShowLoadMore" v-if="searchList.length" :articleList="searchList"
				@saveSearchHistory="saveSearchHistory"></ListItem>
			<view class="no-data" v-else>
				没有搜索到相关数据
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				parentVal: '',
				searchList: [],
				isShowLoadMore: false,
				isShowHistory: true
			}
		},
		methods: {
			async _sendSearchData() {
				this.isShowHistory = false;
				if (!this.parentVal) {
					this.searchList = [];
					this.isShowHistory = true;
					return
				}
				const data = await this.$http.get_search_data({
					searchVal: this.parentVal
				})
				this.searchList = data;
			},
			saveSearchHistory() {
				this.setHistory(this.parentVal)
			},
			...mapMutations(['setHistory','clearHistory']),
			// 点击搜索历史记录进行搜索
			openHistory(val){
				this.parentVal = val;
				this._sendSearchData() // 搜索信息
			}
		},
		computed:{
			...mapState(['historyList'])
		},
		
	}
</script>

<style lang="scss">
	@import './css/search.scss';
</style>
