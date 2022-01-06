'use strict';
const db = uniCloud.database() // 获取数据库的引用
exports.main = async (event, context) => {
	const collection = db.collection('label');
	const {data} = await collection.get();
	//返回数据给客户端
	return {
		code:0,
		data,
		msg:'查询数据失败'
	}
};
