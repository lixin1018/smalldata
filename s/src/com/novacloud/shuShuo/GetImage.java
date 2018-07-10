package com.novacloud.shuShuo; 

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream; 
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse; 
 
import com.novacloud.novaone.common.NcpSession; 
import com.novacloud.novaone.dao.sys.ContextUtil; 

public class GetImage extends HttpServlet{    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {  
           
        request.setCharacterEncoding("UTF-8");    
        ShuShuoProcessor shuShuoProcessor = null;
        try {
    		NcpSession session = new NcpSession(request.getSession()); 
            shuShuoProcessor = (ShuShuoProcessor)ContextUtil.getBean("shuShuoProcessor");    

            String dirName = this.getParameterValue(request, "d");  
            String imageName = this.getParameterValue(request, "m");
            
            byte[] data = this.getImageData(shuShuoProcessor, dirName, imageName);
            this.writeResponse(shuShuoProcessor, response, data);
        }
        catch (Exception e) { 
			e.printStackTrace(); 
            try {
            	byte[] data = this.getImageData(shuShuoProcessor, "error", "404.jpg");
				this.writeResponse(shuShuoProcessor, response, data);
			} 
            catch (Exception e1) {
            	throw new IOException(e.getMessage());
			}
		}     
    } 
    
    private void writeResponse(ShuShuoProcessor shuShuoProcessor, HttpServletResponse response, byte[] data) throws Exception{  
        OutputStream out = null;
        try { 
            out = response.getOutputStream();
            response.setContentType("image/jpg"); 
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
    
    private byte[] getImageData(ShuShuoProcessor shuShuoProcessor, String dirName, String imageName) throws Exception{
        FileInputStream fis = null;
        try {
	        String imageFilePath = shuShuoProcessor.getImagePath(dirName, imageName);
	        
	        File file = new File(imageFilePath);
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
