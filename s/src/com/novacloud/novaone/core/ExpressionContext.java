package com.novacloud.novaone.core;
 
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import com.novacloud.novaone.expression.definition.Environment; 

/**
 * @Description: 快速开发工具配置 
 * 项目名称：novaone  
 * @Title: ConfigContext.java 
 * @Package com.novacloud.novaone.core 
 * @author 于采兴
 * @date 2015-2-14 下午02:28:46 
 * @version V1.0
 */
public class ExpressionContext { 
	
	private static final Logger logger = LogManager.getLogger(ExpressionContext.class.getName()); 
	private static boolean isInited = false;
	
	public synchronized static boolean initContext() {
		if (isInited) {
			return true;
		}
		logger.info("init ExpressionContext...");
		try {
			Environment.initFromFile();
		} catch (Exception e) {
			throw new RuntimeException("init expression context error",e);
		}
		 
		
		isInited = true;
		return true;
	}  
}
