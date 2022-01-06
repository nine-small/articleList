export default {
	install(Vue) {
		Vue.mixin({
			data() {
				return {
					"userRules": {
						"loginName": {
							"rules": [{
								"required": true,
								"errorMessage": "账户名不能为空"
							},
							{
								validateFunction:this.validateLoginName   // 用户名自定义函数验证
							},
							]
						},
						"password":{
							"rules":[
								{
									"required":true,
									"errorMessage":"密码不能为空"
								}
							]
						},
						"phone":{
							"rules":[
								{
									"required":true,
									"errorMessage":"手机号码不能为空"
								},
								{
									validateFunction:this.validatePhone // 验证手机号码的自定义函数
								}
							]
						},
						"vCode":{
							"rules":[
								{
									"required":true,
									"errorMessage":"验证码不能为空"
								},{
									validateFunction:this.validateCode // 验证码自定义验证规则
								}
							]
						}
					}
				}
			},
			methods: {
				// 用户名验证函数
				validateLoginName(rule,val,data,callback){
					switch(true){
						case val.length < 6 :
						callback('用户名长度不正确')
						break;
						default :
						callback();
					}
				},
				// 验证手机号
				validatePhone(rule,val,data,callback){
					const reg = /^1[\d]{10,10}$|^[\d]{8,8}$/
					switch(true){
						case !reg.test(val):
						callback("手机号码不正确");
						break;
						default:
						callback()
					}
				},
				// 验证验证码
				validateCode(rule,val,data,callback){
					switch(true){
						case val !== this.returnCode:
						callback("请输入正确的验证码");
						break;
						default:
						callback()
					}
				}
			}
		})
	}
}
