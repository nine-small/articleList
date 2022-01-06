<template>
	<view>
		<!-- 用户登陆了 -->
		<view v-if="userInfo" class="my-header">
			<view class="my-header-background">
				<image :src="userInfo.avatar" mode="aspectFill"></image>
			</view>
			<view class="my-header-logo">
				<view class="my-header-logo-box" @click="changeAvatar">
					<image :src="userInfo.avatar" mode="aspectFill"></image>
				</view>
				<text class="user-nane">{{userInfo.author_name}}</text>
			</view>
			<view class="my-header-info">
				<view class="my-header-info-box">
					<text class="my-header-ifon-title">被关注</text>
					<text>{{userInfo.follow_count}}</text>
				</view>
				<view class="my-header-info-box">
					<text class="my-header-ifon-title">粉丝</text>
					<text>{{userInfo.fans_count}}</text>
				</view>
				<view class="my-header-info-box">
					<text class="my-header-ifon-title">积分</text>
					<text>{{userInfo.integral_count || 0}}</text>
				</view>
			</view>
		</view>
		<view class="my-content">
			<!-- 用户未登陆 -->
			<view v-if="!userInfo" class="my-content-list" @click="login">
				<view class="my-content-list-title">
					<image class="company-logo" src="../../static/img/logo.jpeg" mode="aspectFill"></image>
					<text>HI，您尚未登陆，请点击登陆</text>
				</view>
				<uni-icons type="arrowright" color="#666" size="14"></uni-icons>
			</view>
			<view class="my-content-list">
				<view class="my-content-list-title" @click="toMyArticle">
					<uni-icons class="icon" type="contact" size="16" color="#666"></uni-icons>
					<text>我的文章</text>
				</view>
				<uni-icons type="arrowright" color="#666" size="14"></uni-icons>
			</view>
			<view class="my-content-list" @click="goFeedbackPage">
				<view class="my-content-list-title">
					<uni-icons class="icon" type="help" size="16" color="#666"></uni-icons>
					<text>意见反馈</text>
				</view>
				<uni-icons type="arrowright" color="#666" size="14"></uni-icons>
			</view>
			<!-- #ifdef APP-PLUS -->
			<view class="my-content-list" @click="haveNew&&_getNewVersion">
				<view class="my-content-list-title">
					<uni-icons class="icon" type="paperclip" size="16" color="#666"></uni-icons>
					<view class="version-container">
						<text>当前版本
							<text v-if="haveNew" class="new-version-tip">(点击下载最新版本)</text>
						</text>
						<text class="version">{{currentVersion}}</text>
					</view>
				</view>
				<uni-icons type="arrowright" color="#666" size="14"></uni-icons>
			</view>
			<!-- #endif -->
			<button type="warn" v-if="userInfo" class="sigin-out" @click="siginOut">退出</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				haveNew: false,
				currentVersion: "1.0.0"
			}
		},
		onLoad(){
			// #ifdef APP-PLUS
				uni.getSystemInfo({
					success: (res) => {
						if(res.platform === 'android'){
							plus.runtime.getProperty(plus,runtime.appid,wgtinfo=>{
								this.currentVersion = wgtinfo;
								this._checkVersion();
							})
						}
					}
				})
			// #endif
		},
		methods: {
			// 退出
			siginOut() {
				this.$store.commit('updateUserInfo', null);
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},
			// 跳转到登陆页
			login() {
				uni.navigateTo({
					url: '/pages/userInfo/login/login'
				})
			},
			// 检测当前应用的版本
			async _checkVersion(){
				const {
					version,
					downLoadLinkUrl
				} = await this.$http.get_current_version();
				if(version > this.currentVersion){
					this.haveNew = true;
					this.downLoadLinkUrl = downLoadLinkUrl;
				}
			},
			// 最新版本下载
			_getNewVersion() {
			         uni.showLoading({title:'下载中，请稍后'});
			          var dtask = plus.downloader.createDownload(this.downLoadLinkUrl, {}, function (d, status) {
			           // 下载完成  
			           uni.hideLoading({})
			           if (status == 200) {
			             plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, {}, function (error) {
			               uni.showToast({
			                 title: '安装失败',
			                 duration: 1500,
			                 icon: 'none'
			               });
			             })
			           } else {
			             uni.showToast({
			               title: '更新失败',
			               duration: 1500,
			               icon: 'none'
			             });
			           }
			         });
			         dtask.start();
			       },
				   // 跳转到我的文章
				   toMyArticle(){
					   // uni.navigateTo({
					   // 	url:'/pages/myArticle/myArticle'
					   // })
				   	this.$Router.push({
				   		path:"/pages/myArticle/myArticle"
				   	})
				   },
				   // 跳转到意见反馈见面
				   goFeedbackPage(){
					   this.$Router.push({
					   	path:"/pages/feedback/feedback"
					   })
				   },
				   //
				   changeAvatar(){
					 uni.chooseImage({
					 	count:1,
						success:async (res)=> {
							const filePath = await this._uploadFile(res.tempFilePaths[0],res.tempFiles[0].name)
							await this._updateUserAvatar(filePath)
							
						}
					 })  
				   },
				   // 上传图片
				   async _uploadFile(filePath,cloudPath){
					   const {fileID} = await uniCloud.uploadFile({
					   	filePath,
						cloudPath
					   })
					   return fileID
				   },
				   // 更改用户及发布文章的头像
				   async _updateUserAvatar(filePath){
					   const {msg} = await this.$http.update_user_avatar({
						   user_id:this.userInfo._id,
						   filePath
					   })
					   uni.showToast({
					   	icon:"none",
						title:msg
					   })
					   // 跟新本地缓存
					   this.updateUserInfo({...this.userInfo,avatar:filePath})
				   }
		},

	}
</script>

<style lang="scss">
	@import './css/self.scss'
</style>
