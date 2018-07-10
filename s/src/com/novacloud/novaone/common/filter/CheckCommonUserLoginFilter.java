package com.novacloud.novaone.common.filter;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.novacloud.novaone.common.util.CommonFunction;

public class CheckCommonUserLoginFilter implements Filter {

	 
	//需要排除的页面
	private String excludedPages;	  
	private HashMap<String, String> excludedPageMap = new HashMap<String, String>();   
	
    @Override  
    public void doFilter(ServletRequest arg0, ServletResponse arg1, FilterChain arg2) throws IOException, ServletException {  
        HttpServletRequest request = (HttpServletRequest)arg0;  
        HttpServletResponse response = (HttpServletResponse)arg1;
        String pageUrl = request.getServletPath();
        if(pageUrl.endsWith(".jsp") && !excludedPageMap.containsKey(pageUrl)){           
	        HttpSession session = request.getSession();  
	        if(session.getAttribute("userId")==null){   
	        	String loginRedirectUrl = CommonFunction.encode(request.getRequestURL().toString() + (request.getQueryString() ==null ? "" : ( "?" + request.getQueryString())));
	        	response.sendRedirect(request.getContextPath()+ "/page/h/home/login.jsp?loginRedirectUrl=" + loginRedirectUrl);
	        } 
	        else {  
	            arg2.doFilter(request, response);  
	        }  
        }
        else {  
            arg2.doFilter(request, response);  
        }  
    }  
  
    @Override  
    public void destroy() {  
    } 
    
    //初始化函数，获取需要排除在外的url
    public void init(FilterConfig fConfig) throws ServletException {  
	    excludedPages = fConfig.getInitParameter("excludedPages");  
	    if (excludedPages != null && excludedPages.length() > 0) {  
	    	String[] excludedPageArray = excludedPages.split(",");
	    	for(int i = 0; i < excludedPageArray.length; i++){
	    		excludedPageMap.put(excludedPageArray[i], null);
	    	}
	    }   
    } 
}
