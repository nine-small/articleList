'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		user_id,
		filePath
	} = event;
	
	const user = await db.collection('user').doc(user_id).get();
	const oldUrl = user.data[0].avatar;
	// 跟新用户头像的操作
	await db.collection('user').doc(user_id).update({
		"avatar":filePath
	})
	// 判断之前的用户头像是否包含在对象存储里面，如果说有的话，我们给他进行一个删除的操作。
	try{
		await uniCloud.deleteFile({
			fileList:[oldUrl]
		})
	}catch(e){
		//TODO handle the exception
		console.log(e)
	}
	// 跟新文章里面的作者头像的操作
	const id = user.data[0].id;
	await db.collection('article').where({
		'author.id':id
	}).update({
		'author.avatar':filePath
	})
	//返回数据给客户端
	return {
		code:0,
		data:{
			msg:"修改头像成功"
		}
	}
};
