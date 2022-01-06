<template>
	<view class="home-container">
		<!-- 搜索框 -->
		<NavBar></NavBar>
		<!-- 选项卡 小程序不支持v-on语法，v-bind语法 -->
		<TabBar :labelList="labelList" :activeIndex="activeIndex" @changeActiveIndex="changeActiveIndex"></TabBar>
		<!-- 文章列表组件 -->
		<ArticleList class="list-container" :labelList="labelList" :activeIndex="activeIndex"
			@changeActiveIndex="changeActiveIndex"></ArticleList>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				activeIndex: 0
			};
		},
		onLoad() {
			this._initLabelList();
		},
		methods: {
			...mapMutations(['setLabelList']),
			// 获取菜单列表
			async _initLabelList() {
				if (this.labelList.length) return;
				const resp = await this.$http.get_label_list()
				this.setLabelList([{name: "全部"}, ...resp]);
			},
			// 获取文章列表
			changeActiveIndex(index) {
				if (this.activeIndex === index) return;
				this.activeIndex = index
			}
		},
		computed: {
			labelList(){
				let data = this.$store.state.labelList;
				let label_ids = this.userInfo && this.userInfo.label_ids;
				if(this.userInfo){
					this.activeIndex = 0;
					let all = data.slice(0,1);
					let choose = data.filter(ele=>(label_ids && label_ids.includes(ele._id)))
					return [...all,...choose]
				}else{
					return data;
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		display: flex;
		height: 100%;
	}

	.home-container {
		flex: 1;
		overflow: hidden;
		box-sizing: border-box;
		@include flex(flex-start, column);
		align-items: inherit;
	}

	.list-container {
		flex: 1;
		box-sizing: border-box;
	}
</style>
