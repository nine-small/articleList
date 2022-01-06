<template>
	<view class="tab">
		<!-- 水平的滚动区域,选项卡自动进行位置调整，scroll-view组件添加属性scroll-with-animation 和 scroll-left属性
		 动态的设置scrollintoview属性，为每一项添加ID属性进行跳转切换  currentIndex不能以数字开头
		 https://uniapp.dcloud.io/component/scroll-view
		 -->
		<scroll-view scroll-x="true" class="tab-scroll" :scroll-into-view="currentIndex" :scroll-with-animation="true">
			<view class="tab-scroll-box">
				<view :key="item._id" :id="`item${index}`" @click="changeActiveIndex(index)"
					:class="{active:activeIndex === index}" class="tab-scroll-item" v-for="(item,index) in labelList">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		<!-- 图标部分 -->
		<view class="tab-icon" @click="toLabelAdmin">
			<uni-icons type="gear" size="26" color="#666"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		name: "TabBar",
		props: {
			labelList: Array,
			activeIndex: Number
		},
		methods: {
			changeActiveIndex(index) {
				this.$emit('changeActiveIndex', index)
			},
			// 跳转到标签管理页面
			async toLabelAdmin() {
				await this.checkedisLogin(); // 在common中定义好的，验证当前是否登陆，如果登陆了就继续执行下面的内容，没有登陆则直接跳转到登陆页
				uni.navigateTo({
					url: "../../pages/labelAdmin/labelAdmin"
				})
			}
	},
	computed: {
		currentIndex() {
			return `item${this.activeIndex}`
		}
	}
	}
</script>

<style lang="scss" scoped>
	@import './css/TabBar.scss'
</style>
