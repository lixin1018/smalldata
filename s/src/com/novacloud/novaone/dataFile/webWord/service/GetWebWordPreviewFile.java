package com.novacloud.novaone.dataFile.webWord.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.sys.ContextUtil; 
import com.novacloud.novaone.dataFile.webWord.WebWordFileProcessor; 

public class GetWebWordPreviewFile extends HttpServlet{   
	protected Session openDBSession() throws SQLException{ 
		HibernateTransactionManager transactionManager = (HibernateTransactionManager)ContextUtil.getBean("transactionManager"); 
		return transactionManager.getSessionFactory().openSession(); 
	}	 
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {  
           
        request.setCharacterEncoding("UTF-8");    
        WebWordFileProcessor webWordFileProcessor = null;   
        Session dbSession = null;
        try {
    		NcpSession session = new NcpSession(request.getSession()); 
    		dbSession = this.openDBSession();
    		webWordFileProcessor = (WebWordFileProcessor)ContextUtil.getBean("webWordFileProcessor");   
    		webWordFileProcessor.setDBSession(dbSession); 

            String accessoryId = this.getParameterValue(request, "accessoryid");    

			DataRow accessoryRow = webWordFileProcessor.getAccessoryDataRow(session, accessoryId);
			String fileName = accessoryRow.getStringValue("name") + ".pdf";  
			String filePath = webWordFileProcessor.getAccessoryFilePath(accessoryId) + ".pdf";  
            
            byte[] data = this.getFileData(filePath);
            this.writeResponse(response, data, fileName);
        }
        catch (Exception e) { 
			e.printStackTrace();  
        	throw new IOException(e.getMessage()); 
		}     
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}  
    } 
    
    private void writeResponse(HttpServletResponse response, byte[] data, String fileName) throws Exception{  
        OutputStream out = null;
        try { 
            out = response.getOutputStream();
            response.setContentType("application/pdf"); 
            response.setHeader("Content-Disposition", "fileName=" + fileName);   
            out.write(data);
            out.flush();
        }
        catch (Exception e) { 
			throw e; 
		}   
		finally{ 
			if(out != null){
	            out.close();
			}
		}       
    }
    
    private byte[] getFileData(String filePath) throws Exception{
        FileInputStream fis = null;
        try { 
	        File file = new File(filePath);
	        fis = new FileInputStream(file);
	
	        long size = file.length();
	        byte[] temp = new byte[(int) size];
	        fis.read(temp, 0, (int) size); 
	        byte[] data = temp;
			return data;  
        }
        catch (Exception e) { 
			throw e;
		}   
		finally{
			if(fis != null){
				fis.close();
			} 
		}     
    }
    
    private String getParameterValue(HttpServletRequest request, String parameterName){
    	switch(request.getMethod()){
		case "POST": 
	    	return request.getParameter(parameterName);  
		case "GET":
		default:
	    	return request.getParameter(parameterName);   
    	}
    }
 
}
