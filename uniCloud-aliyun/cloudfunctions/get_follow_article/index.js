'use strict';
const db = uniCloud.database();
// 聚合操作符
const $ = db.command.aggregate;

exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		user_id
	} = event;
	
	let userInfo = await db.collection('user').doc(user_id).get();
	// 获取收藏的文章id的数组
	let article_likes_ids = userInfo.data[0].article_likes_ids;
	let list = await db.collection('article')
	.aggregate()
	.addFields({
		is_like:$.in(['$_id',article_likes_ids])  // 参数是一个数组，
	})
	.project({
		content:0
	})
	.match({
		is_like:true
	})
	.end()
	//返回数据给客户端
	return {
		code:0,
		data:{
			msg:"获取数据成功",
			data:list.data
		}
	}
};
