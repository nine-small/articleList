'use strict';
// 获取数据库的引用
const db = uniCloud.database();
exports.main = async (event, context) => {
	const {type,loginName,password,phone,vCode} = event;
	const { affectedDocs,data } = await db.collection('user')
	.aggregate()
	.match(type==='account' ? {loginName,password} : {phone})
	.end()
	//返回数据给客户端
	return affectedDocs ? {
		code:0,
		msg:"登陆成功",
		data:data[0]
	} : {
		code:1,
		msg:type === "account" ? "用户名或密码错误" : "手机号或验证码错误",
		data:null	
	}
};
