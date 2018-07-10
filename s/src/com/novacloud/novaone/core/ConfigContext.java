package com.novacloud.novaone.core;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap; 
import java.util.Map;
import java.util.Properties; 
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import com.novacloud.novaone.constants.NovaCloudState; 

/**
 * @Description: 快速开发工具配置 
 * 项目名称：novaone  
 * @Title: ConfigContext.java 
 * @Package com.novacloud.novaone.core 
 * @author 于采兴
 * @date 2015-2-14 下午02:28:46 
 * @version V1.0
 */
public class ConfigContext { 
	
	private static final Logger logger = LogManager.getLogger(ConfigContext.class.getName());
	public static final String PROPERTIES_FILE = "config.properties";
	private static Properties reportProperties = new Properties();
	private static Map<String, String> configMap = new HashMap<String, String>();
	private static boolean isInited = false;
	
	public synchronized static boolean initContext() {
		if (isInited) {
			return true;
		}
		logger.info("init ConfigContext...");
		InputStream is = ConfigContext.class.getClassLoader().getResourceAsStream(PROPERTIES_FILE);
		try {
			reportProperties.load(is);
		} catch (IOException e) {
			throw new RuntimeException(PROPERTIES_FILE + " file load error");
		}
		
		//加载可供修改的banner图片地址
		configMap.put(NovaCloudState.NOVAONE_BANNER, reportProperties.getProperty(NovaCloudState.NOVAONE_BANNER_PROPERTIES));
		//当前所采用的样式
		configMap.put(NovaCloudState.NOVAONE_UI_STYLE, reportProperties.getProperty(NovaCloudState.NOVAONE_UI_STYLE_PROPERTIES));
		//加载系统默认密码
		configMap.put(NovaCloudState.NOVAONE_DEFAULT_PASSWORD, reportProperties.getProperty(NovaCloudState.NOVAONE_DEFAULT_PASSWORD_PROPERTIES));
		//加载项目名称
		configMap.put(NovaCloudState.NOVAONE_PROJECT_NAME, reportProperties.getProperty(NovaCloudState.NOVAONE_PROJECT_NAME_PROPERTIES));
		//用户退出系统的请求地址
		configMap.put(NovaCloudState.NOVAONE_REQUEST_URL, reportProperties.getProperty(NovaCloudState.NOVAONE_REQUEST_URL_PROPERTIES));
		//用户退出系统请求允许后，返回的页面地址(此处仅应用于servlet)
		configMap.put(NovaCloudState.NOVAONE_PAGEJUMP_URL, reportProperties.getProperty(NovaCloudState.NOVAONE_PAGEJUMP_URL_PROPERTIES));
		//邮箱服务器参数值
		configMap.put(NovaCloudState.NOVAONE_EMAIL_SERVER, reportProperties.getProperty(NovaCloudState.NOVAONE_EMAIL_SERVER_PROPERTIES));
		//发送邮箱是否需要认证
		configMap.put(NovaCloudState.NOVAONE_EMAIL_NEED_LOGIN, reportProperties.getProperty(NovaCloudState.NOVAONE_EMAIL_NEED_LOGIN_PROPERTIES));
		//发送邮箱用户名称
		configMap.put(NovaCloudState.NOVAONE_EMAIL_USERNAME, reportProperties.getProperty(NovaCloudState.NOVAONE_EMAIL_USERNAME_PROPERTIES));
		//邮箱帐号密码参数值
		configMap.put(NovaCloudState.NOVAONE_EMAIL_ACCOUNT_PWD, reportProperties.getProperty(NovaCloudState.NOVAONE_EMAIL_ACCOUNT_PWD_PROPERTIES));
		//邮箱帐号参数值
		configMap.put(NovaCloudState.NOVAONE_EMAIL_ACCOUNT, reportProperties.getProperty(NovaCloudState.NOVAONE_EMAIL_ACCOUNT_PROPERTIES));
		//file storage dir path in data managment function
		configMap.put(NovaCloudState.NOVAONE_DATAMANAGMENT_STORAGEDIR, reportProperties.getProperty(NovaCloudState.NOVAONE_DATAMANAGMENT_STORAGEDIR_PROPERTIES));
		//workflow timing drive user id
		configMap.put(NovaCloudState.NOVAONE_WORKFLOW_TIMINGDRIVEUSERID, reportProperties.getProperty(NovaCloudState.NOVAONE_WORKFLOW_TIMINGDRIVEUSERID_PROPERTIES));
		//excelGrid Definition Save Directory Path
		configMap.put(NovaCloudState.NOVAONE_EXCELGRID_DEFINITIONFILEDIRECTORY, reportProperties.getProperty(NovaCloudState.NOVAONE_EXCELGRID_DEFINITIONFILEDIRECTORY_PROPERTIES));
		//excelGrid Instance Save Directory Path
		configMap.put(NovaCloudState.NOVAONE_EXCELGRID_INSTANCEFILEDIRECTORY, reportProperties.getProperty(NovaCloudState.NOVAONE_EXCELGRID_INSTANCEFILEDIRECTORY_PROPERTIES));
		//importExport Save Directory Path
		configMap.put(NovaCloudState.NOVAONE_IMPORTEXPORT_DEFINITIONFILEDIRECTORY, reportProperties.getProperty(NovaCloudState.NOVAONE_IMPORTEXPORT_DEFINITIONFILEDIRECTORY_PROPERTIES));
		
		//test();
		
		isInited = true;
		return true;
	} 
	
	/**
	 * 
	 * @return
	 */
	public static Map<String, String> getConfigMap() {
		return configMap;
	}
}
