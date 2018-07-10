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

public class GetAudio extends HttpServlet{    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {  
           
        request.setCharacterEncoding("UTF-8");    
        ShuShuoProcessor shuShuoProcessor = null;
        try {
    		NcpSession session = new NcpSession(request.getSession()); 
            shuShuoProcessor = (ShuShuoProcessor)ContextUtil.getBean("shuShuoProcessor");    

            String dirName = this.getParameterValue(request, "d");  
            String audioName = this.getParameterValue(request, "a");
            
            byte[] data = this.getAudioData(shuShuoProcessor, dirName, audioName);
            this.writeResponse(shuShuoProcessor, response, data);
        }
        catch (Exception e) { 
			e.printStackTrace();  
        	throw new IOException(e.getMessage()); 
		}     
    } 
    
    private void writeResponse(ShuShuoProcessor shuShuoProcessor, HttpServletResponse response, byte[] data) throws Exception{  
        OutputStream out = null;
        try { 
            out = response.getOutputStream();
            response.setContentType("audio/basic"); 
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
    
    private byte[] getAudioData(ShuShuoProcessor shuShuoProcessor, String dirName, String audioName) throws Exception{
        FileInputStream fis = null;
        try {
	        String audioFilePath = shuShuoProcessor.getAudioPath(dirName, audioName);
	        
	        File file = new File(audioFilePath);
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
