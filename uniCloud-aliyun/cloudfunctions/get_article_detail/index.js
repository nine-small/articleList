'use strict';
const db = uniCloud.database();
const _ = db.command;
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {article_id} = event;
	await db.collection('article').doc(article_id).update({
		browse_count: _.inc(1)
	})
	const {data} = await db.collection('article')
	.aggregate()
	.match({
		_id:article_id
	})
	.project({
		comments:0
	})
	.end();	
	//返回数据给客户端
	return {
		code:0,
		msg:"文章获取成功",
		data:data[0]
	}
};
