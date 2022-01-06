'use strict';
const db = uniCloud.database();
const $ = db.command.aggregate;
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		user_id
	} = event;
	const userInfo = await db.collection('user').doc(user_id).get();
	const author_likes_ids = userInfo.data[0].author_likes_ids;
	const list = await db.collection("user")
		.aggregate()
		.addFields({
			is_likes: $.in(['$id', author_likes_ids])
		})
		.project({
			loginName: false,
			password: false
		})
		.match({
			is_likes: true
		})
		.end()
	//返回数据给客户端
	return {
		code: 0,
		data: {
			msg: "获取数据成功",
			data: list.data
		}
	};
}
