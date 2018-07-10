package com.novacloud.novaone.common.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.novacloud.novaone.common.NcpNonePurviewException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.model.sysmodel.PagePurviewHash;

public class CheckPagePurviewFilter implements Filter {
    @Override  
    public void init(FilterConfig arg0) throws ServletException {  
    }   

	private PagePurviewHash pagePurviewHash = null; 
	
    @Override  
    public void doFilter(ServletRequest arg0, ServletResponse arg1, FilterChain arg2) throws IOException, ServletException { 
    	if(this.pagePurviewHash == null){
    		this.pagePurviewHash = (PagePurviewHash)ContextUtil.getBean("pagePurviewHash"); 
    	}
    	
    	HttpServletRequest request = (HttpServletRequest)arg0;  
        HttpServletResponse response = (HttpServletResponse)arg1;  
        String url = "../" + request.getRequestURI().substring(request.getContextPath().length() + 6); 

        
		NcpSession session;
		try {
			session = new NcpSession(request.getSession());
		} catch (Exception e) { 
			e.printStackTrace();
        	throw new NcpNonePurviewException("NonePurview", url, null);
		}
        
        if(PagePurviewHash.isEnable(url, session.getRoleList())){
            arg2.doFilter(request, response); 
        }
        else{
        	throw new NcpNonePurviewException("NonePurview", url, null);
        }
        
        
        
    }  
  
    @Override  
    public void destroy() {  
    } 
}
