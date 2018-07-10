﻿
//单据编辑状态类型
var formStatusType={disable:"disable",browse:"browse",edit:"edit"}; 

//ToolBar按钮类型
var toolBarButtonType={add:"add",save:"save",remove:"remove",print:"print",edit:"edit",cancel:"cancel",
		find:"find",first:"first",previous:"previous",next:"next",last:"last",refresh:"refresh",
		accessory:"accessory",spaceLine:"spaceLine"};

//字段类型
var valueType={string:"string", decimal:"decimal", boolean:"boolean", date:"date", time:"time", object:"object"};

//附件类型
var accessoryType={word:"*.doc;*.docx;",excel:"*.xlsx;xls;",jpg:"*.jpg;",gif:"*.gif;",png: "*.png;"};

//消息对话框
var msgBox = new MsgBox();

//一般通用处理
var cmnPcr = new CommonProcessor(); 

//服务器通讯
var serverAccess = new ServerAccess();

var gridWinBtnStatus = {
		"add":{"browse":true,"edit":true,"disable":false},
		"edit":{"browse":true,"edit":true,"disable":false},
		"save":{"browse":false,"edit":true,"disable":false},
		"cancel":{"browse":false,"edit":true,"disable":false},
		"delete":{"browse":true,"edit":true,"disable":false},
		"pagination":{"browse":true,"edit":true,"disable":false},
		"search":{"browse":true,"edit":false,"disable":false} ,
		"complexQuery":{"browse":true,"edit":false,"disable":false} 
}
var cardWinBtnStatus = {
		"add":{"browse":true,"edit":false,"disable":false},
		"edit":{"browse":true,"edit":false,"disable":false},
		"save":{"browse":false,"edit":true,"disable":false},
		"cancel":{"browse":false,"edit":true,"disable":false},
		"delete":{"browse":true,"edit":true,"disable":false},
		"pagination":{"browse":true,"edit":true,"disable":false} 
} 

var expRunAt ={"server":"Server", "js":"Js", "all":"All", "none":"None"}

var dataModels = {};
var viewModels = {};
var sheetModels = {};
var treeModels = {};
var paramWinModels = {};
var reportModels = {};

//客户端实体类容器，用于表达式
var iocClient = {
	//注入实体
	addEntity : function(name, entity){
		this[name] = function(){
			return entity;
		};
	},
	//执行表达式
	execExp:function(exp){
		eval(exp);
	}
};