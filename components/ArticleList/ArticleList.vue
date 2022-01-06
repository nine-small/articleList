<template>
	<swiper :current="activeIndex" @change="changeActiveIndex" class="swiper-container">
		<!-- swiper-item的个数，应该和labelList一致 -->
		<swiper-item v-for="item in labelList" :key="item._id">
			<view class="swiper-item">
				<ListItem :loadMore="loadData[activeIndex] && loadData[activeIndex].loadMore" :articleList="articleData[activeIndex]" @_getMore="_getMore"></ListItem>
			</view>
		</swiper-item>
	</swiper>
</template>

<script>
	export default {
		name: "ArticleList",
		props: {
			labelList: Array,
			activeIndex: Number
		},
		data() {
			return {
				articleData: {},
				loadData:{}, // 把每一页的状态做一个保存
				loadMore:'more',
			}
		},
		created(){
			this.labelList.length && this._initArticleList(this.activeIndex)
		},
		watch: {
			labelList(newValue, oldValue) {
				if(JSON.stringify(newValue) === JSON.stringify(oldValue)) return
				this.articleData = {};
				this.loadData = {};
				this._initArticleList(this.activeIndex)
			}
		},
		methods: {
			changeActiveIndex(e) {
				const {
					current
				} = e.detail;
				this.$emit('changeActiveIndex', current);
				if(!this.articleData[current] || !this.articleData[current].length){ // 查看articleData中是否有属性为current的值，如果有，就不再发送请求了
					this._initArticleList(current)
				}
			},
			async _initArticleList(currentIndex) {
				// 指定每一个分类里面的页数信息
				if(!this.loadData[currentIndex]){
					this.loadData[currentIndex] = {
						page:1,
						total:0,
						pageSize:5,
						loadMore:'more'
					}
				}
				const {page,pageSize} = this.loadData[currentIndex];
				const {data,total} = await this.$http.get_article_list({
					classify: this.labelList[currentIndex].name,
					page,
					pageSize
				})
				let oldList = this.articleData[currentIndex] || [];
				let result = [...oldList,...data]
				this.$set(this.articleData,currentIndex,result);
				this.loadData[currentIndex].total = total;
				if(total == result.length) {
					this.loadData[currentIndex].loadMore = 'noMore'
				}
			},
			async _getMore(){
				if(this.articleData[this.activeIndex].length == this.loadData[this.activeIndex].total) {
					this.loadMore = 'noMore'
					return 
				};
				this.loadData[this.activeIndex].loadMore = 'loading'
				this.loadData[this.activeIndex].page++;
				await this._initArticleList(this.activeIndex)
				this.loadData[this.activeIndex].loadMore = 'more'
			}
		}
	}
</script>

<style lang="scss">
	.swiper-container {
		height: 100%;

		.swiper-item {
			height: 100%;
			overflow: hidden;
		}
	}
</style>
