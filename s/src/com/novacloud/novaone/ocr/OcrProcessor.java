package com.novacloud.novaone.ocr; 

import java.awt.image.BufferedImage;
import java.io.File;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.imageio.ImageIO;

import org.hibernate.Session;

import com.novacloud.novaone.common.FileOperate;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.SysConfig; 
import com.novacloud.novaone.dao.db.IDBParserAccess;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sourceforge.tess4j.ITessAPI.TessOcrEngineMode;
import net.sourceforge.tess4j.ITessAPI.TessPageSegMode;
import net.sourceforge.tess4j.Tesseract; 
 
public class OcrProcessor{ 

	//执行数据库操作的通用类
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	private IDBParserAccess getDBParserAccess() {
		return this.dBParserAccess;
	}
	
	private Session dbSession = null;
	public Session getDBSession() {
		return dbSession;
	}
	public void setDBSession(Session dbSession) {
		this.dbSession = dbSession;
	} 
	
	private static Tesseract tessInstance = null;
	private static Tesseract getTessInstance(){
		if(tessInstance == null){	
            Tesseract instance = Tesseract.getInstance();
            instance.setDatapath("d:/t");//设置训练库 
            instance.setLanguage("chi_sim");//中文识别 
            instance.setPageSegMode(TessPageSegMode.PSM_SINGLE_BLOCK);
            //instance.setOcrEngineMode(TessOcrEngineMode.OEM_TESSERACT_ONLY);
            tessInstance = instance;
		}
		return tessInstance;
	}

	public String getStringFromImage(String filePath) throws Exception {  
	   try {
            System.out.println("start");
            double start=System.currentTimeMillis(); 
            File imageFile = new File(filePath.trim());
            if (!imageFile.exists()) {
                throw new Exception("图片不存在");
            }
            else{
	            BufferedImage textImage = ImageIO.read(imageFile);
	            String result = null;
	            Tesseract instance = this.getTessInstance();
	            result = instance.doOCR(textImage);
	            double end=System.currentTimeMillis();
	            System.out.println("耗时"+(end-start)/1000+" s");
	            System.out.println(result);
	            return result;
            }
	   } 
	   catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
	} 
}
