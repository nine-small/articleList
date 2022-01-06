'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		article_id,
		pageSize=10,
		page=1
	} = event;

	const {data} = await db.collection('article')
	.aggregate()
	.match({
		_id:article_id
	})
	.unwind("$comments")
	.project({
		_id:0,
		comments:1
	})
	.replaceRoot({
		newRoot:"$comments"
	})
	.skip(pageSize * (page - 1))
	.limit(pageSize)
	.end()
	
	const res = await db.collection('article').doc(article_id).get()
	let total = 0 ; 
	res.data[0].comments && (total = res.data[0].comments.length)
	//返回数据给客户端
	return {
		code:0,
		msg:"请求成功",
		data:{
			data,
			msg:"请求成功",
			total
		}
	}
};
