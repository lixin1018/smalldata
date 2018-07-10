/**
 * 系统常量
 */
var SCRIPT_COMMON = {
	/**YES*/
	'FLAG_1_YES': 'YES',
	/**NO*/
	'FLAG_0_NO': 'NO',
	/**y*/
	'FLAG_Y': 'Y',
	/**n*/
	'FLAG_N': 'N',
	/** Default */
	'FLAG_DEFAULT': 'Default',
	/** nova banner */
	'NOVAONE_BANNER': 'novaBanner'
	
}

/**
 * 询问常量
 */
var SCRIPT_CONFIRM = {
	/**确定要上报吗*/
	'ASK_MSG_1': '确定要上报吗?',
	/**确定提交审批结果吗*/
	'ASK_MSG_2': '确定提交审批结果吗?',
	/**请选择要删除的数据。*/
	'ASK_MSG_3': '请选择要删除的数据。',
	/**请选择要修改的数据。*/
	'ASK_MSG_4': '请选择要修改的数据。',
	/**只能选择一条数据。*/
	'ASK_MSG_5': '只能选择一条数据。',
	/**请先选择菜单节点！*/
	'ASK_MSG_6': '请先选择菜单节点！',
	/**此菜单节点只允许有一个根菜单！*/
	'ASK_MSG_7': '此菜单节点只允许有一个根菜单！',
	/**请选择要重置密码的数据。*/
	'ASK_MSG_8': '请选择要重置密码的数据。',
	/**确定要重置选中帐号的密码吗*/
	'ASK_MSG_9': '确定要重置选中帐号的密码吗?',
	/**数据禁止修改。*/
	'ASK_MSG_10': '数据禁止修改。',
	/**暂无可操作数据。*/
	'ASK_MSG_11': '暂无可操作数据。',
	/**确定要重置状态为可修改吗*/
	'ASK_MSG_12': '确定要重置状态为可修改吗?',

	/**
	 * {0}失败！
	 * @param {Object} name 要替换的字符串
	 */
	optionfail:function(name){
		return name + "失败！";
	},
	/**
	 * {0}成功！
	 * @param {Object} name 要替换的字符串
	 */
	optionSuccess:function(name){
		return name + "成功！";
	},
	/**
	 * 无{0}数据！
	 * @param {Object} name 要替换的字符串
	 */
	optionNoData:function(name){
		return "无" + name + "数据！";
	},
	/**年度不能为空*/
	'VALIDATE_MSG_1': '年度不能为空！',
	/**月份不能为空 */
	'VALIDATE_MSG_2': '月份不能为空！',
	/**采油厂不能为空*/
	'VALIDATE_MSG_3': '采油厂不能为空！',
	/**无此采油厂的维护权限*/
	'VALIDATE_MSG_4': '无此采油厂的维护权限！',
	/**未找到此选项!*/
	'VALIDATE_MSG_5': '未找到此选项!',
	/**起始日期不能为空*/
	'VALIDATE_MSG_6': '起始日期不能为空!',
	/**起始日期不能大于终止日期*/
	'VALIDATE_MSG_7': '起始日期不能大于终止日期!',
	/**单位不能为空*/
	'VALIDATE_MSG_8': '单位不能为空!',
	/**组织机构编码不能为空*/
	'VALIDATE_MSG_9': '组织机构编码不能为空!',
	
	'MSG_0': ''
}