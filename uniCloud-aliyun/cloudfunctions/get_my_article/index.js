'use strict';
const db = uniCloud.database();
const _ = db.command;
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		user_id
	} = event;
	const userInfo = await db.collection('user').doc(user_id).get();
	const article_ids = userInfo.data[0].article_ids;
	const {data} = await db.collection('article')
	.aggregate()
	.project({
		content:0,
		comments:0
	})
	.match({
		id:_.in(article_ids)
	})
	.end();
	
	//返回数据给客户端
	return {
		code:0,
		data:{
			data,
			msg:"数据请求成功"
		}
	}
};
