package com.novacloud.dataHelper.export;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.orm.hibernate4.HibernateTransactionManager;

import com.novacloud.dataHelper.buy.BuyProcessor;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.constants.NovaCloudState;
import com.novacloud.novaone.core.ConfigContext;
import com.novacloud.novaone.dao.sys.ContextUtil; 

public class GetExportFile extends HttpServlet{    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {  
           
        request.setCharacterEncoding("UTF-8");    
        BuyProcessor buyProcessor = null;
        try {
    		NcpSession session = new NcpSession(request.getSession());  
    		buyProcessor = (BuyProcessor)ContextUtil.getBean("dataHelperBuyProcessor");    

            String orderLineId = this.getParameterValue(request, "olid");
            String fileName = this.getParameterValue(request, "fn");  
            String t = this.getParameterValue(request, "t"); 
            
            String[] tParts = buyProcessor.checkDownloadUrl(t);
             
            String filePath = ConfigContext.getConfigMap().get(NovaCloudState.NOVAONE_IMPORTEXPORT_DEFINITIONFILEDIRECTORY)
            		+ "\\export" + "\\" + tParts[1] + "\\" + tParts[2] + ".xlsx";
            
            
            byte[] data = this.getFileData(filePath);
            this.writeResponse(response, data, fileName + "_" + tParts[2]);
        }
        catch (Exception e) { 
			e.printStackTrace();  
        	throw new IOException(e.getMessage());
        }   
    } 
    
    private void writeResponse(HttpServletResponse response, byte[] data, String fileName) throws Exception{  
        OutputStream out = null;
        try { 
            out = response.getOutputStream();
            response.setHeader("Content-Disposition", "attachment;filename=\"" + URLEncoder.encode(fileName,"UTF-8") + ".xlsx\"");
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); 
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
 
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {   
        doGet(req, resp);    
    }  
}
