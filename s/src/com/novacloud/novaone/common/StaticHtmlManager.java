package com.novacloud.novaone.common;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.Map;

import javax.servlet.ServletContext;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;

/**
 * @Description: 生成静态HTML文件<br>
 * 
 * 调用freemarker模板生成静态html文件
 * 
 * 项目名称：woomall-module  
 * @Title: StaticHtmlManager.java 
 * @Package com.woomall.common.utils 
 * @author 于采兴
 * @date 2015-3-24 下午02:24:15 
 * @version V1.0
 */
public class StaticHtmlManager {

	private static Configuration cfg;

	private static Log logger = LogFactory.getLog(StaticHtmlManager.class);
	
	private static void init(ServletContext request) {
		cfg = new Configuration();
		cfg.setServletContextForTemplateLoading(request,"WEB-INF/ftl");
		cfg.setDefaultEncoding("UTF-8");
	}
	
	/**
	 * 生成静态HTML
	 * @param datas 需要动态写入的数据
	 * @param toPath 静态HTML文件生成的路径
	 * @param ftlName 模版名称
	 * @param htmlName 静态HTML文件名称
	 * @throws IOException
	 * @throws TemplateException 
	 */
	public static boolean generateFile(ServletContext request,Map<String,Object> datas,String toPath,String ftlName,String htmlName){
		init(request);
		try{
			Template t = cfg.getTemplate(ftlName);
			t.setEncoding("UTF-8");
			File afile = new File(request.getRealPath("/")+toPath + "/"+htmlName);
			Writer out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(afile),"UTF-8"));
			t.process(datas, out);
			out.close();
			return true;
		}catch(Exception e){
			logger.error("生成静态文件异常，异常信息为:"+e.getMessage());
			return false;
		}
	}
}
