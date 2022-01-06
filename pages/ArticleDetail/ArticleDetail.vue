<template>
	<view class="article-detail-container">
		<view class="detail-title">{{articleData.title}}</view>
		<view class="detail-header">
			<view class="detail-logo">
				<image :src="articleData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="detail-header-content">
				<view class="detail-header-content-title">{{articleData.author.author_name}}</view>
				<view class="detail-header-content-info">
					<text>{{articleData.create_time}}</text>
					<text>{{articleData.browse_count}}浏览</text>
					<text>{{articleData.thumbs_up_count}}赞</text>
				</view>
			</view>
			<button type="default" class="detail-header-button" @click="_followAuthor">{{isFollowAuthor}}</button>
		</view>
		<!-- 文章部分 -->
		<view class="detail-content-container">
			<view class="detail-html">
				<u-parse :content="content"></u-parse>
			</view>
		</view>
		<!-- 评论内容部分 -->
		<view class="detail-comment">
			<view class="detail-title">最新评论</view>
			<view class="comment-content-container" v-for="item in commentList" :key="item.comment_id">
				<CommentBox :commentData="item" @commentReply="commentReply"></CommentBox>
			</view>
			<view class="no-data" v-if="!commentList.length">暂无评论</view>
		</view>

		<!-- 评论/输入组件 -->
		<view class="detail-bottom">
			<view class="input-container" @click="openMaskerComment">
				<text>谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<view class="detail-bottom-icons">
				<view class="detail-bottom-icon-box" @click="_toDetailComments">
					<uni-icons type="chat" size="22" color="#f07373"></uni-icons>
				</view>
				<view class="detail-bottom-icon-box">
					<SaveLikes :articleId="articleData._id"></SaveLikes>
				</view>
				<view class="detail-bottom-icon-box" @click="_is_thumb_up">
					<uni-icons :type="isCompliments" size="22" color="#f07373"></uni-icons>
				</view>
			</view>
		</view>
		<!-- 评论组件 -->
		<CommentMasker :showPopup="showPopup" @closePopupMasker="showPopup=$event" @sendCommentData="_sendCommentData">
		</CommentMasker>
	</view>
</template>

<script>
	import {
		marked
	} from 'marked';
	import uParse from '@/components/feng-parse/parse.vue';
	export default {
		components: {
			uParse
		},
		data() {
			return {
				articleData: null,
				showPopup: false,
				commentList: [],
				replyData: {}
			};
		},
		methods: {
			async _getArticleDetail() {
				this.articleData = await this.$http.get_article_detail({
					article_id: this.articleData._id
				})
			},
			// 打开弹窗
			async openMaskerComment() {
				await this.checkedisLogin();
				this.showPopup = true;
			},
			// 发送评论内容到后端
			async _sendCommentData(commentVal, cb) {
				const {
					msg
				} = await this.$http.update_comment({ // 更新评论内容
					user_id: this.userInfo._id, // 用户id
					article_id: this.articleData._id, // 文章id
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
				this._getCommentList()
				// 清空输入框的内容
				cb && cb();
			},
			// 获取文章评论列表
			async _getCommentList() {
				// 获取的是哪一篇文章的内容，需要把文章的id传给后端
				const {
					data,
					total
				} = await this.$http.get_comments({
					article_id: this.articleData._id
				});
				this.commentList = data
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
			// 改变用户关注作者的状态
			async _followAuthor() {
				await this.checkedisLogin();
				const {
					msg,
					data
				} = await this.$http.update_follow_author({
					author_id: this.articleData.author.id, // 作者的id
					user_id: this.userInfo._id
				}); // 我的id
				// 显示弹窗
				uni.showToast({
					icon: "none",
					title: msg
				})
				// 修改store里面的用户存储的状态 => 本地存储也会修改
				this.updateUserInfo(data)
				uni.$emit('updateAuthor')
			},
			// 是否给作者点赞
			async _is_thumb_up() {
				const {msg,data} = await this.$http._is_thumb_up({
					article_id: this.articleData._id,
					user_id: this.userInfo._id
				})
				uni.showToast({
					icon:"none",
					title:msg
				})
				this.updateUserInfo(data);
				const num = msg === '取消点赞' ? -1 : 1;
				this.articleData.thumbs_up_count += num;
			},
			// 跳转到评论详情
			async _toDetailComments(){
				// 做一个是否登陆的判断
				await this.checkedisLogin();
				uni.navigateTo({
					url:`/pages/details-comments/details-comments?article_id=${this.articleData._id}`
				})
			}
		
		},
		onLoad() {
			this.articleData = this.$Router.currentRoute.query ;
			// 文章详情的获取
			this._getArticleDetail();
			// 文章评论列表的获取
			this._getCommentList();
		},
		computed: {
			content() {
				return this.articleData && this.articleData.content && marked(this.articleData.content)
			},
			// 是否关注作者
			isFollowAuthor() {
				// 如果关注了，就显示取消关注
				if (this.userInfo && this.userInfo.author_likes_ids.includes(this.articleData && this.articleData.author &&
						this.articleData.author.id)) {
					return "取消关注"
				} else {
					return "关注"
				}
			},
			// 是否对文进行点赞
			isCompliments() {
				if (this.userInfo && this.userInfo.thumbs_up_article_ids && this.userInfo.thumbs_up_article_ids.includes(
						this.articleData && this.articleData._id)) {
					return 'hand-up-filled'
				} else {
					return 'hand-up'
				}
			}
		}
	};
</script>

<style lang="scss">
	@import "./css/ArticleDetail.scss";
</style>
