'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		commentVal, //评论的内容
		article_id, // 文章的id
		user_id, // 用户的id
		comment_id = '', // 评论id，默认值为空。
		reply_id = '',
		is_reply = false // 是否属于子回复的，默认不是。
	} = event;
	// 获取用户信息 collection选择表，
	// 通过doc进行筛选,通过用户的id进行筛选
	//  get拿到数据值
	// 结构并重新命名为user
	let {
		data: user
	} = await db.collection('user').doc(user_id).get();
	user = user[0]
	// 获取文章的数据 collection选择表
	// doc进行选择
	// get获取数据，返回数据为一个对象，值在data属性值中
	const {
		data: article
	} = await db.collection('article').doc(article_id).get();
	// 如果没有拿到数据，article => []
	// 如果article中没有配置comments，赋值为一个空数组。
	const comments = article[0] && article[0].comments || [];
	// 配置一个评论对象。
	let commentObj = {
		comment_id: generatedId(5), // 该条评论的id值，随机生成的
		comment_content: commentVal, // 评论的内容，前端传过来的
		created_time: Date.now(), // 创建该条评论的时间
		replyArr: [], // 这条评论的回复评论，初始值为空数组
		is_reply, // 是否属于内部的回复
		reply_id,
		author: { // 该条评论是谁的，信息来自登陆信息userInfo，前端传回的user_id。
			_id: user._id, // 发表评论者的id
			name: user.author_name, // 发表评论者的姓名
			avatar: user.avatar, // 发表评论者的头像
			// professinonal:user.professinonal
		}
	}
	// 如果没有传comment_id，说明该条评论不是点击的回复，而是点击底部的发布。
	if (comment_id === '') {
		// 是底部的发布，默认其子评论应该也为空。
		commentObj.replyArr = [];
		commentObj = dbCmd.unshift(commentObj)
	} else {
		// 根据前端传过来的值，找到这条评论的人的名字。
		let commentAuthor = null;
		// 能进到该阶段，说明不是直接评论，而是回复的某条评论（最外面的一层评论）。查询前端传过来的评论位于comments中的索引值。
		// 将第二层及以后的评论都放在replyArr中了
		let commentIndex = comments.findIndex(item => item.comment_id === comment_id);

		if (is_reply) {
			//  如果是内部的回复。
			let data = comments[commentIndex].replyArr.find(ele => ele.comment_id === reply_id)
			data && (commentAuthor = data.author.name)
		} else {
			// 说明回复的是最外面的一层                                                                                                                                                                                                                             
			commentAuthor = comments[commentIndex].author.name;
		}
		// 新增一条属性to ,值为写这条评论的人的名字（name）
		commentObj.to = commentAuthor;
		// 获取当前的评论的集合，在这个集合里面找到指定的那一条评论，修改他的replyArr属性。根据索引值进行匹配
		commentObj = {
			[commentIndex]: {
				replyArr:dbCmd.unshift(commentObj)
			}
		}
	}
	// 找到article这张表，根据article_id找到对应的文章，更新commnets属性值
	await db.collection('article').doc(article_id).update({
		comments: commentObj
	})
	// 生成一个唯一的id值，辅助函数
	function generatedId(num) {
		return Number(Math.random().toString().substr(2, num) + Date.now()).toString(16)
	}
	//返回数据给客户端
	return {
		code: 0,
		data: {
			msg: "添加数据成功"
		}
	}
};
