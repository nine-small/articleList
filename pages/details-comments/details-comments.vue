<template>
	<view class="comment-list-container">
		<scroll-view :scroll-y="true" class="detail-comments"  @scrolltolower="_fetchMore">
			<view v-for="item in commentList" :key="item._id" class="item">
				<CommentBox :commentData="item" @commentReply="commentReply"></CommentBox>
			</view>
			<uni-load-more v-if="isShowLoadMore" :status="loadMore"></uni-load-more>
		</scroll-view>
		<CommentMasker :showPopup="showPopup" @closePopupMasker="showPopup=$event" @sendCommentData="_sendCommentData">
		</CommentMasker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				commentList: [],
				page: 1,
				pageSize: 5,
				article_id: '',
				showPopup: false,
				loadMore:'more',
				isShowLoadMore:true
			}
		},
		onLoad(...options) {
			this.article_id = options[0].article_id;
			this._getDetailComments()
		},
		methods: {
			async _getDetailComments() {
				const {
					data,total
				} = await this.$http.get_comments({
					page: this.page,
					pageSize: this.pageSize,
					article_id: this.article_id
				})
				if (this.commentList.length) {
					this.commentList = [...this.commentList, ...data]
				} else {
					this.commentList = data;
				}
				this.total = total;
				if(this.commentList.length === total){
					this.loadMore = 'noMore'
				}
			},
			// 发送评论内容到后端
			async _sendCommentData(commentVal, cb) {
				const {
					msg
				} = await this.$http.update_comment({ // 更新评论内容
					user_id: this.userInfo._id, // 用户id
					article_id: this.article_id, // 文章id
					commentVal, // 弹出层盒子传递上来的需要发送给后端的值。
					...this.replyData //评论id comment_id 以及is_reply 是否是子回复。
				})
				// 新增成功后，展示msg
				uni.showToast({
					title: msg,
					icon: "none"
				})
				// 关闭弹窗
				this.showPopup = false;
				// 重新获取数据
				this.page = 1;
				this.commentList = [];
				this._getDetailComments()
				// 清空输入框的内容
				cb && cb();
			},
			// 处理回复事件函数
			commentReply(data) {
				this.replyData = {
					...data
				}
				data.reply_id && (this.replyData.reply_id = data.reply_id)
				// 打开弹窗
				this.openMaskerComment()
			},
			// 打开弹窗
			async openMaskerComment() {
				await this.checkedisLogin();
				this.showPopup = true;
			},
			// 获取更多评论
			async _fetchMore() {
				if(this.total == this.commentList.length) {
					this.loadMore = "noMore"
					return
				}   //如果没有更多数据，直接return
				this.page++;
				this.loadMore = 'loading'
				await this._getDetailComments()
				this.loadMore = 'more'
			}
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
	}
	.comment-list-container{
		height: 100%;
		overflow: hidden;
	}
	.detail-comments {
		height: 100%;
		.item {
			padding: 0 30rpx;
			border: 1px solid #eee;
		}
	}
</style>
