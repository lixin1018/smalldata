package com.novacloud.novaone.excelGrid.filter;

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

import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.excelGrid.definition.ExcelGridProcessor;
import com.novacloud.novaone.excelGrid.team.TeamProcessor;

public class CheckIsDefinitionCreator implements Filter {
    @Override  
    public void doFilter(ServletRequest arg0, ServletResponse arg1, FilterChain arg2) throws IOException, ServletException {  
        HttpServletRequest request = (HttpServletRequest)arg0;  
        HttpServletResponse response = (HttpServletResponse)arg1;          
        HttpSession session = request.getSession();  
        String userId = (String) session.getAttribute("userId");
        String definitionId = request.getParameter("excelgrid");
        HibernateTransactionManager transactionManager = (HibernateTransactionManager) ContextUtil.getBean("transactionManager");
        
        Session dbSession = null;
        try{
        	dbSession = transactionManager.getSessionFactory().openSession();
        	ExcelGridProcessor excelGridProcessor = (ExcelGridProcessor) ContextUtil.getBean("excelGridProcessor");
        	excelGridProcessor.setDBSession(dbSession);
    		if(!excelGridProcessor.isDefinitionCreator(definitionId, userId)){
            	response.sendRedirect(request.getContextPath() + "/page/h/home/error.jsp");
    		}
	        else {  
	            arg2.doFilter(request, response);  
	        }  
        }
        catch(Exception ex){
        	response.sendRedirect(request.getContextPath() + "/page/h/home/error.jsp");
        }
        finally{
        	if(dbSession != null){
        		dbSession.close(); 
        	}
        }
    }  
  
    @Override  
    public void destroy() {  
    }

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub
		
	}  
}
