'use strict';
// const db = uniCloud.database()
// exports.main = async (event, context) => {
// 	const {phone} = event;
	
// 	// 创建一个随机数
// 	const currentNumber = Math.random().toString().substr(2,6)
// 	//返回数据给客户端
// 	return event
// };

exports.main = async (event, context) => {
	const {phone} = event;
	// 创建一个随机数
	const currentNumber = Math.random().toString().substr(2,6)
	//返回数据给客户端
	try{
		const res = await uniCloud.sendSms({
			appid:"__UNI__0D695A9",
			smsKey:"25cfa81fcade420555022b1ee4021a8a",
			smsSecret:"d79e45ec2456c4d6ffc7956dba4e1f43",
			phone,
			templateId:"12333",
			data:{
				code:currentNumber,
				expMinute:"1"
			}
		})
		// 调用成功，请注意这时不代表发送成功
		return {
			code:0,
			data:{
				msg:"请在手机上注意查收验证码",
				mobilCode:currentNumber
			}
		};
	}catch(err){
		// 调用失败
		return {
			code:1,
			msg:'短信验证码发送失败'
		}
	}
	
	
	
	
};
