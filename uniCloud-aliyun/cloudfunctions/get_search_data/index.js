'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const {
		searchVal
	} = event;

	const list = await db.collection('article')
		.aggregate()
		.match({
			title:new RegExp(searchVal)
		})  //聚合阶段。根据条件过滤文档，并且把符合条件的文档传递给下一个流水线阶段。 根据正则模糊查询
		.project({
			content: 0
		}) // 聚合阶段。把指定的字段传递给下一个流水线，指定的字段可以是某个已经存在的字段，也可以是计算出来的新字段。
		.end()
	// uniCloud的聚合操作
	//返回数据给客户端
	
	return {
		code: 0,
		msg: "数据获取成功",
		data: list.data
	}
};
