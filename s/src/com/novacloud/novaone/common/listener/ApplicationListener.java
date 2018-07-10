package com.novacloud.novaone.common.listener;


import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.novacloud.novaone.core.ConfigContext;
import com.novacloud.novaone.core.ExcelGridExpressionContext;
import com.novacloud.novaone.core.ExpressionContext;
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.dao.sys.SystemContext;
 

public class ApplicationListener implements ServletContextListener {
    public void contextInitialized(ServletContextEvent event) {
       ServletContext context = event.getServletContext();
       try {
    	   initContextUtil(context);
			
    	   // 平台参数配置初始化
    	   ConfigContext.initContext();
           
    	   // 初始化系统配置
    	   SystemContext.initContext();
    	   
    	   // 表达式配置初始化
    	   ExpressionContext.initContext();
    	   
    	   // ExcelGrid表达式配置初始化
    	   ExcelGridExpressionContext.initContext();
    	   
    	   
          
       } catch (Exception ex) {
           ex.printStackTrace();
       }
    } 
      
    private void initContextUtil(ServletContext context) throws Exception{
           ApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(context);
           ContextUtil.setContext(ctx); 
    }

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		
	} 
}