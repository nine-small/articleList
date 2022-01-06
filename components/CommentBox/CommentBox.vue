<template>
	<view class="comment-box">
		<view class="comment-header">
			<view class="comment-header-logo">
				<!-- 评论者的头像 -->
				<image :src="commentData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="comment-header-info">
				<!-- 评论者姓名 -->
				<view class="title" v-if="!is_reply">{{commentData.author.name}}</view>
				<view class="title" v-else>{{commentData.author.name}} 回复 {{commentData.to}}</view>
				<view>
					<!-- 格式化时间的插件uni-date-format -->
					<uni-dateformat :date="commentData.created_time" format="yyyy-MM-dd hh:mm:ss"></uni-dateformat>
				</view>
			</view>
		</view>
		<!-- 评论内容展示 -->
		<view class="comment-content">
			<!-- 评论内容 -->
			<view>{{commentData.comment_content}}</view>
			<view class="comment-info">
				<!-- 指定人员的内容回复  -->
				<view class="comment-button" @click="commentReply({
					comment_id:commentData.comment_id, // 该条评论的id值
					is_reply // 是否是回复的
				})">回复</view>
			</view>
			<!-- 是否有子回复，子回复的暂时区域 -->
			<view class="comment-replay-list" v-for="item in commentData.replyArr" :key="item.comment_id">
				<CommentBox :is_reply="true" :commentData="item" @commentReply="commentReply">
				</CommentBox>
			</view>
		</view>
		<!--  -->

	</view>
</template>

<script>
	import CommentBox from '@/components/CommentBox/CommentBox.vue'
	export default {
		name: "CommentBox",
		components: {
			CommentBox
		},
		props: {
			commentData: Object,
			// 自己调用自己的时候，说明是内部子回复
			is_reply: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			// 回复评论按钮
			commentReply(data) {
				// 通知父组件，打开弹窗。
				// 并且给父组件传递一些数据。
				// 谁回复的谁
				// 如果是自组件内部的调用，就需要修改一下comment_id的值
				if(data.is_reply){
					data.reply_id = data.comment_id;
					data.comment_id = this.commentData.comment_id;
				}
				this.$emit("commentReply", data)
			}
		}
	}
</script>

<style lang="scss">
	@import './css/CommentBox.scss'
</style>
