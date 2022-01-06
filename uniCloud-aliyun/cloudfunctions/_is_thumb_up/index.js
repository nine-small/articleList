'use strict';
const db = uniCloud.database();
const _ = db.command;
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		article_id,
		user_id
	} = event;
	let {
		data: user
	} = await db.collection('user').doc(user_id).get();
	const articleIds = user[0] && user[0].thumbs_up_article_ids;
	let articleArr = null;
	let msg = '';
	if(articleIds.includes(article_id)){
		// 取消点赞
		articleArr = _.pull(article_id);
		msg = "取消点赞"
	}else{
		// 点赞
		articleArr = _.unshift(article_id)
		msg = "点赞成功"
	}
	// 跟新数据
	await db.collection('user').doc(user_id).update({
		thumbs_up_article_ids:articleArr
	})
	// 获取新的用户数据返回给前端
	const newUserInfo = await db.collection('user').doc(user_id).get();
	// 处理文章的点赞数量
	await db.collection('article').doc(article_id).update({
		thumbs_up_count:_.inc(msg === "取消点赞" ? -1 : 1)
	})
	//返回数据给客户端
	return {
		code:0,
		data:{
			msg,
			data:newUserInfo.data[0]
		}
	}
};
