package com.novacloud.novaone.common.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.novacloud.novaone.common.loader.InstallSqlLoader; 

/**
 * 模块化平台版本控制监听类
 * 完成各模块的自动布署
 * 
 * @author 于采兴
 * @version 1.0.0 2015-2-14
 * @since platform 1.0
 */
public class NovaoneLoaderListener implements ServletContextListener {

	public void contextDestroyed(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		
	}

	public void contextInitialized(ServletContextEvent pServletContextEvent) {
		//final String WEB_HOME = pServletContextEvent.getServletContext().getRealPath("/");
		//ResourcesLoader.load(WEB_HOME); 
		InstallSqlLoader.install();
	}

}
