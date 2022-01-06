<template>
  <view>
    <!-- 基础卡片 -->
    <view
      class="list-card"
      v-if="item.mode === 'base'"
      @click="goArticleDetail"
    >
      <view class="list-card-img">
        <image
          mode="aspectFill"
          class="list-card-img"
          :src="
            item.cover[0] ||
            'https://pc.hyfarsight.com/Fsf4RfIJyetNpvsXUmlGbQkhYoWA'
          "
        ></image>
      </view>
      <view class="list-card-content">
        <view class="list-card-content-title">
          <text>{{ item.title }}</text>
          <SaveLikes :articleId="item._id"></SaveLikes>
        </view>
        <view class="list-card-content-desc">
          <view class="article-type">{{ item.classify }}</view>
          <view class="browse-number">{{ item.browse_count }}浏览</view>
        </view>
      </view>
    </view>
    <!-- 多图模式 -->
    <view
      class="list-card mode-column"
      v-if="item.mode === 'column'"
      @click="goArticleDetail"
    >
      <view class="list-card-top">
        <text>{{ item.title }}</text>
        <SaveLikes :articleId="item._id"></SaveLikes>
      </view>
      <view class="list-card-middle">
        <view
          class="image-container"
          v-for="(ele, index) in item.cover.slice(0, 3)"
          :key="index"
        >
          <image mode="aspectFill" class="list-card-img" :src="ele"></image>
        </view>
      </view>
      <view class="list-card-content">
        <view class="list-card-content-desc list-card-bottom">
          <view class="article-type">{{ item.classify }}</view>
          <view class="browse-number">{{ item.browse_count }}浏览</view>
        </view>
      </view>
    </view>
    <!-- 大图模式 -->
    <view
      class="list-card mode-image"
      v-if="item.mode === 'image'"
      @click="goArticleDetail"
    >
      <view class="list-card-top">
        <view class="image-container">
          <image mode="aspectFill" class="list-card-img" :src="item.cover[0]">
          </image>
        </view>
      </view>
      <view class="list-card-middle">
        <text>{{ item.title }}</text>
        <SaveLikes :articleId="item._id"></SaveLikes>
      </view>
      <view class="list-card-content">
        <view class="list-card-content-desc list-card-bottom">
          <view class="article-type">{{ item.classify }}</view>
          <view class="browse-number">{{ item.browse_count }}浏览</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "ListCard",
  props: {
    item: Object,
  },
  methods: {
    goArticleDetail() {
      const { _id, title, author, create_time, thumbs_up_count, browse_count } =
        this.item;
      const query = {
        _id,
        title,
        author,
        create_time,
        thumbs_up_count,
        browse_count
      };
      //跳转到文章详情
	  this.$Router.push({
		  path:`/pages/ArticleDetail/ArticleDetail`,
		  query
	  })
      // 发送收藏自定义事件
      this.$emit("saveSearchHistory");
    },
  },
};
</script>

<style lang="scss">
@import "./css/ListCard.scss";
</style>
