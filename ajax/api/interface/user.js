import ajax from '../../https.js';

// 用户登陆

export const user_login = data => ajax({
	name: "user_login",
	data
})

//  获取验证码

export const get_code = data => ajax({
	name: "get_code",
	data
})

// 修改是否关注作者

export const update_follow_author = data => ajax({
	name: "update_follow_author",
	data
})

// 用户对这篇文章是否点赞
export const _is_thumb_up = data => ajax({
	name: "_is_thumb_up",
	data
})

//  获取收藏文章

export const get_follow_article = data => ajax({
	name: "get_follow_article",
	data
})

//  获取喜欢的作者

export const get_follow_author = data => ajax({
	name: "get_follow_author",
	data
})

// 获取最新的版本

export const get_current_version = data => ajax({
	name:"get_current_version",
	data
})

// 获取我的文章

export const get_my_article = data => ajax({
	name:"get_my_article",
	data
})

// 反馈意见提交

export const update_feedback = data => ajax({
	name:"update_feedback",
	data
})

// 更改用户头像

export const update_user_avatar = data => ajax({
	name:"update_user_avatar",
	data
})

