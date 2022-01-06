'use strict';
const db = uniCloud.database();
const _ = db.command;
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		user_id,
		author_id
	} = event
	// 根据用户传过来的用户id查找到对应的用户信息。
	const user = await db.collection('user').doc(user_id).get();
	// 查找该用户的关注列表，是一个数组
	const author_likes_ids = user.data[0].author_likes_ids;
	// 用来返回的
	let returnMsg = "";
	// 
	let author_ids = null;
	
	if(author_likes_ids.includes(author_id)){
		author_ids = _.pull(author_id)
		returnMsg = "取消关注"
	}else{
		returnMsg = "关注成功"
		author_ids = _.addToSet(author_id)
	}
	await db.collection('user').doc(user_id).update({
		author_likes_ids:author_ids
	})
	const newUser = await db.collection('user').doc(user_id).get();
	//返回数据给客户端
	return {
		code:0,
		data:{
			msg:returnMsg,
			data:newUser.data[0]
		}
	}
};
