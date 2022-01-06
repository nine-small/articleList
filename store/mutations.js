export default {
	updateUserInfo(state,userInfo){
		uni.setStorageSync('userInfo',userInfo) // 修改本地存储
		state.userInfo = userInfo; // 修改store中的userInfo
	},
	// 修改历史记录存储
	setHistory(state,val){
		let list = state.historyList;
		if(list.length > 0 && list.indexOf(val) !== -1) return;
		list.unshift(val);
		uni.setStorageSync('historyList',list);
		state.historyList = list;
	},
	// 清空历史记录存储
	clearHistory(state){
		let list = state.historyList;
		if(!list.length) return;
		uni.removeStorageSync('historyList');
		state.historyList = [];
	},
	//设置导航栏选项卡
	setLabelList(state,labelList){
		uni.setStorageSync('labelList',labelList);
		state.labelList = labelList;
	}	
}