<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %> 
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %>  
<%@ page import="java.util.List" %>
<%@ page import="com.novacloud.novaone.dao.db.DataRow" %>
<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<%@ page import="com.novacloud.novaone.common.ValueConverter" %>
<%@ page import="com.novacloud.novaone.dataFile.exe.control.ExeControl" %> 
<%@ page import="com.novacloud.novaone.dataFile.exe.ExeConfig" %> 
<%
	String did = request.getParameter("did");
	HttpSession httpSession = request.getSession();
	NcpSession ncpSession = new NcpSession(httpSession, true); 
	String userId = ncpSession.getUserId();  
	ExeControl exeControl = (ExeControl)ContextUtil.getBean("exeControl"); 
	
	try{
		ExeConfig exeConfig = exeControl.loadConfig(ncpSession, did);
		String exeCode = exeConfig.getCode();
		response.sendRedirect("../" +exeCode + "/" + exeCode + ".jsp?exeid=" + did);
	}
	catch(Exception ex){
		response.sendRedirect("error.jsp");
	}
%> 