// 请求方法的封装 --- 减少代码的冗余，优化代码的可读性以及维护性，进行请求方法的封装
// 定义公共的http请求方法。
// 该函数返回一个promise对象
export default ({
	name, // 云函数名字
	data = {} // 传递给云函数的参数
}) => {
	return new Promise((resolve,reject)=>{
		!data.isLoading && uni.showLoading({}) //开启一个加载的动画效果
		data.isLoading && delete data.isLoading; // isLoading这个值不用发送给后端
		uniCloud.callFunction({ // uniCloud的函数调用，真正发送请求的部分
			name, // 云函数名字
			data, // 云函数参数
			success({result}){
				const {code,data,msg} = result; // 返回的结果中应包含code data msg
				if(code === 0){  // 说明能真正拿到数据
					resolve(data) 
				}else{ // 后端没有查询到数据值
					uni.showToast({
						icon:"none",
						title:msg
					})
				}
			},// 成功请求后
			fail(err){ // 网络问题或者是后端出现了问题
				reject(err)
			},// 请求出现错误
			complete(){ // 不管成功还是失败，只要完成了就行
				!data.isLoading && uni.hideLoading() // 关闭加载的动画
			}//请求完成
		})
	})
}
