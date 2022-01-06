<template>
	<view class="label-container">
		<view class="label-box">
			<view class="label-header">
				<text class="label-title">我的标签</text>
				<text class="label-edit" @click="changeEditStatus">{{isEdit ? "完成" : "编辑"}}</text>
			</view>
			<view class="label-content">
				<view @click="changeSelfLabelList(item)" class="label-content-item" v-for="item in seltLabelList" :key="item._id">
					{{item.name}}
					<uni-icons class="icon-close" type="clear" color="#f40" size="20" v-show="isEdit"></uni-icons>
				</view>
				<view class="no-data" v-if="!seltLabelList.length">
					当前没有数据
				</view>
			</view>
		</view>
		<!-- 标签推荐 -->
		<view class="label-box">
			<view class="label-header">
				<text class="label-title">标签推荐</text>
			</view>
			<view class="label-content">
				<view @click="changeUpdateLabelList(item)" class="label-content-item" v-for="item in updateLabelList" :key="item._id">
					{{item.name}}
				</view>
				<view class="no-data" v-if="!updateLabelList.length">
					当前没有数据
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				// 当前页面的状态，是否处在编辑状态下
				isEdit: false,
				labelIds:[]
			}
		},
		methods: {
			changeEditStatus() {
				this.isEdit && this._updateLabel()
				this.isEdit = !this.isEdit;
			},
			// 发送给后端
			async _updateLabel() {
				// user信息 userinfo _id / ids => []
				const label_ids = this.seltLabelList.map(ele=>ele._id);
				const {msg} = await this.$http.update_label_ids({userId:this.userInfo._id,label_ids})
				uni.showToast({
					title:msg,
					icon:'none'
				})
				this.updateUserInfo({...this.userInfo,label_ids});
			},
			changeSelfLabelList(item){
				if(!this.isEdit) return
				this.labelIds = this.labelIds.filter(ele=>ele!==item._id)
			},
			changeUpdateLabelList(item){
				if(!this.isEdit) return
				this.labelIds.push(item._id)
			}
		},
		watch:{
			userInfo:{
				immediate:true, // 监听数据，在初始化就调用一次
				handler(newVal,oldVal){
					if(newVal && oldVal && JSON.stringify(newVal.label_ids) === JSON.stringify(oldVal.label_ids)) return
					this.labelIds = this.userInfo && this.userInfo.label_ids || [];
				}
			}
		},
		computed: {
			...mapState(['labelList']),
			seltLabelList(){
				return this.labelList.filter(item=>this.labelIds.includes(item._id))
			},
			// 修改标签
			updateLabelList(){
				return this.labelList.filter(item=>!this.labelIds.includes(item._id) && item._id)
			}
		}
	}
</script>

<style lang="scss">
	@import './css/labelAdmin.scss'
</style>
