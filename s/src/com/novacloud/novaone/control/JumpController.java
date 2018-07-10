package com.novacloud.novaone.control;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;

import com.novacloud.novaone.constants.NovaCloudState;
import com.novacloud.novaone.core.ConfigContext;
import com.opensymphony.xwork2.ActionSupport;

/**
 * @Description: 页面跳转action 
 * 项目名称：novaone  
 * @Title: JumpController.java 
 * @Package com.novacloud.novaone.control 
 * @author 于采兴
 * @date 2015-2-14 下午01:41:47 
 * @version V1.0
 */
@Action
@Results({
		@Result(name = "loginpage", location = "/page/sys/login.jsp")
})
public class JumpController extends ActionSupport { 
	private static final long serialVersionUID = -7775144635147891899L;
	
	HttpServletRequest request = ServletActionContext.getRequest();
	HttpSession session = (HttpSession) request.getSession();
	
	/**
	 * 跳转到登录页面
	 * @return
	 */
	public String loginpage(){
		session.setAttribute(NovaCloudState.NOVAONE_BANNER, ConfigContext.getConfigMap().get(NovaCloudState.NOVAONE_BANNER));
		return "loginpage";
	}
	
}
