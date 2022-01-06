<template>
	<view class="list-item-container">
		<scroll-view scroll-y="true" class="list-scroll" @scrolltolower="getMore">
			<view>
				<ListCard @saveSearchHistory="$emit('saveSearchHistory')" v-for="item in articleList" :item="item" :key="item._id"></ListCard>
			</view>
			<uni-load-more v-if="isShowLoadMore" :status="loadMore"></uni-load-more>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name:"ListItem",
		props:{
			articleList:Array,
			loadMore:{
				type:String,
				default:'more'
			},
			isShowLoadMore:{
				type:Boolean,
				default:true
			}
		},
		methods:{
			getMore(){
				this.$emit("_getMore")
			}
		}
	}
</script>

<style lang="scss">
	.list-item-container{
		height: 100%;
		.list-scroll{
			height: 100%;
			overflow: hidden;
		}
	}
</style>
