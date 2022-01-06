'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const {
		classify,
		page=1,
		pageSize=5
	} = event;
	let matchObj = {} // 是一个匹配对象
	if (classify !== "全部") {
		matchObj = {
			classify
		}
	}
	const list = await db.collection('article')
		.aggregate()
		.match(matchObj)  //聚合阶段。根据条件过滤文档，并且把符合条件的文档传递给下一个流水线阶段。
		.project({
			content: 0
		}) // 聚合阶段。把指定的字段传递给下一个流水线，指定的字段可以是某个已经存在的字段，也可以是计算出来的新字段。
		.skip(pageSize * (page - 1)) // 聚合阶段。指定一个正整数，跳过对应数量的文档，输出剩下的文档。
		.limit(pageSize) //聚合阶段。限制输出到下一阶段的记录数。
		.end()
	// uniCloud的聚合操作
	//返回数据给客户端
	
	// 还需要返回一个total
	const {total} = await db.collection('article').where(matchObj).count()
	return {
		code: 0,
		msg: "数据获取成功",
		data: {data:list.data,total}
	}
};
