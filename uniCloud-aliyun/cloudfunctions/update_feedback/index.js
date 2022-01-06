'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		content,
		user_id,
		feedbackImageList
	} = event;

	await db.collection('feedback').add({
		user_id,
		content,
		feedbackImageList
	})
	//返回数据给客户端
	return {
		code:0,
		data:{
			msg:"提交反馈意见成功"
		}
	}
};
