package com.novacloud.novaone.constants;

import java.io.File;

/**
 * @Description: novaone通用常量类
 * 项目名称：novaone  
 * @Title: NovaCloudState.java 
 * @Package com.novacloud.novaone.constants 
 * @author 于采兴
 * @date 2015-2-14 上午09:44:13 
 * @version V1.0
 */
public class NovaCloudState {
	
	//novaone banner images
	public static final String NOVAONE_BANNER = "novaBanner";
	public static final String NOVAONE_BANNER_PROPERTIES = "novaone.banner.images";
	
	//novaone  ui style
	public static final String NOVAONE_UI_STYLE = "novaUIStyle";
	public static final String NOVAONE_UI_STYLE_PROPERTIES = "novaone.ui.style";
	
	//novaone default password
	public static final String NOVAONE_DEFAULT_PASSWORD = "defaultPassord";
	public static final String NOVAONE_DEFAULT_PASSWORD_PROPERTIES = "novaone.default.password";
	
	//novaone project name
	public static final String NOVAONE_PROJECT_NAME = "projictName";
	public static final String NOVAONE_PROJECT_NAME_PROPERTIES = "novaone.project.title";
	
	//用户退出系统的请求地址(支持servlet和struts)
	public static final String NOVAONE_REQUEST_URL = "requestUrl";
	public static final String NOVAONE_REQUEST_URL_PROPERTIES = "novaone.logout.request.url";
	
	//用户退出系统请求允许后，返回的页面地址(此处仅应用于servlet)
	public static final String NOVAONE_PAGEJUMP_URL = "pageJumpUrl";
	public static final String NOVAONE_PAGEJUMP_URL_PROPERTIES = "novaone.logout.pagejump.url";
	
	//邮箱服务器参数值
	public static final String NOVAONE_EMAIL_SERVER = "emailServer";
	public static final String NOVAONE_EMAIL_SERVER_PROPERTIES = "novaone.email.server";
	
	//发送邮箱是否需要认证
	public static final String NOVAONE_EMAIL_NEED_LOGIN = "emailNeedLogin";
	public static final String NOVAONE_EMAIL_NEED_LOGIN_PROPERTIES = "novaone.email.needlogin";
	
	//发送邮箱用户名称
	public static final String NOVAONE_EMAIL_USERNAME = "emailUsername";
	public static final String NOVAONE_EMAIL_USERNAME_PROPERTIES = "novaone.email.username";
	
	//邮箱帐号密码参数值
	public static final String NOVAONE_EMAIL_ACCOUNT_PWD = "emailAccountPwd";
	public static final String NOVAONE_EMAIL_ACCOUNT_PWD_PROPERTIES = "novaone.email.accountpwd";
	
	//邮箱帐号参数值
	public static final String NOVAONE_EMAIL_ACCOUNT = "emailAccount";
	public static final String NOVAONE_EMAIL_ACCOUNT_PROPERTIES = "novaone.email.account";
	

	//novaone前端组件库目录地址
	public static final String NOVAONE_STYLE_PATH = File.separator
			+ "novaone-style" + File.separator + "plugins" + File.separator
			+ "novaone" + File.separator;
	
	//novaone前端js模型目录地址
	public static final String DATA_MODEL_PATH = NOVAONE_STYLE_PATH
			+ "data-model" + File.separator;
	
	//前端view模型目录
	public static final String DATA_MODEL_PATH_OF_VIEW = DATA_MODEL_PATH + "view" + File.separator;
	//前端data模型目录
	public static final String DATA_MODEL_PATH_OF_DATA = DATA_MODEL_PATH + "data" + File.separator;
	//前端report模型目录
	public static final String DATA_MODEL_PATH_OF_REPORT = DATA_MODEL_PATH + "report" + File.separator;
	//前端sheet模型目录
	public static final String DATA_MODEL_PATH_OF_SHEET = DATA_MODEL_PATH + "sheet" + File.separator;
	//前端tree模型目录
	public static final String DATA_MODEL_PATH_OF_TREE= DATA_MODEL_PATH + "tree" + File.separator;
	//前端paramWin模型目录
	public static final String DATA_MODEL_PATH_OF_PARAMWIN= DATA_MODEL_PATH + "paramWin" + File.separator;
	
	//file storage dir path in data managment function 
	public static final String NOVAONE_DATAMANAGMENT_STORAGEDIR = "dataManagmentStorageDir";
	public static final String NOVAONE_DATAMANAGMENT_STORAGEDIR_PROPERTIES = "novaone.datamanagment.storageDir";
	
	//workflow timing drive user id
	public static final String NOVAONE_WORKFLOW_TIMINGDRIVEUSERID = "workflowTimingDriveUserId";
	public static final String NOVAONE_WORKFLOW_TIMINGDRIVEUSERID_PROPERTIES = "novaone.workflow.timingDriveUserId";

	//excelGrid Definition Save Directory Path
	public static final String NOVAONE_EXCELGRID_DEFINITIONFILEDIRECTORY = "excelGrid.definitionFileDirectory";
	public static final String NOVAONE_EXCELGRID_DEFINITIONFILEDIRECTORY_PROPERTIES = "novaone.excelGrid.definitionFileDirectory";
	
	//excelGrid Instance Save Directory Path
	public static final String NOVAONE_EXCELGRID_INSTANCEFILEDIRECTORY = "excelGrid.instanceFileDirectory";
	public static final String NOVAONE_EXCELGRID_INSTANCEFILEDIRECTORY_PROPERTIES = "novaone.excelGrid.instanceFileDirectory";
	
	//importExport Save Directory Path
	public static final String NOVAONE_IMPORTEXPORT_DEFINITIONFILEDIRECTORY = "importExport.definitionFileDirectory";
	public static final String NOVAONE_IMPORTEXPORT_DEFINITIONFILEDIRECTORY_PROPERTIES = "novaone.importExport.definitionFileDirectory";

	//系统page文件夹相对路径
	public static final String PAGE_PATH = File.separator + "page";
	
	//导入导出查询页面所在文件夹相对路径
	public static final String IMPORTEXPORT_QUERYPAGES_DIR = PAGE_PATH + File.separator + "ie" + File.separator + "queryPages" + File.separator;
}
