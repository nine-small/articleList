/*
利用webpack的require.context方法对所有的请求函数收集。
require.context是webpack的一个api，通过require.context函数获取一个特定的上下文，主要用来实现自动化导入模块，在前端工程中，如果遇到从一个文件夹引入很多模块的情况，可以使用这个api，它会遍历文件夹中的指定文件，然后自动导入，使得不需要每次显示的调用import导入模块。
*/
const requireApi = require.context('.',true,/.js$/);  // '.'表示相对路径  true表示深度的查询  /.js$/表示匹配规则
let module = {};
requireApi.keys().forEach((key,index)=>{
	if(key === './index.js') return
	Object.assign(module,requireApi(key))
})
export default module;