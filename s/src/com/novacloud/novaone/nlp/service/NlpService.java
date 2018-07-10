package com.novacloud.novaone.nlp.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.hankcs.hanlp.seg.common.Term;
import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.ContextUtil; 
import com.novacloud.novaone.dao.sys.ISheetBaseDao;
import com.novacloud.novaone.dao.sys.IUserDefinedFeatureDao;
import com.novacloud.novaone.excelGrid.definition.ExcelGridProcessor;
import com.novacloud.novaone.excelGrid.definition.ValidateException;
import com.novacloud.novaone.excelGrid.definition.ValidateResult;
import com.novacloud.novaone.nlp.NlpProcessor;
import com.opensymphony.xwork2.ActionSupport;
 
/*
 * ExcelGrid服务
 */
public class NlpService extends NcpActionSupport implements INlpService {

	//事务管理器
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	
	//数据库Session
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	
	//实际处理nlp各种操作
	private NlpProcessor nlpProcessor = null;
	public void setNlpProcessor(NlpProcessor nlpProcessor){
		this.nlpProcessor = nlpProcessor;
	}
	public NlpProcessor getNlpProcessor(){
		return this.nlpProcessor;
	}
 
	@Override
	public String segment(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			 
			String text = CommonFunction.decode(requestObj.getString("text"));

			dbSession = this.openDBSession(); 
			this.nlpProcessor.setDBSession(dbSession);
			
			List<Term> terms = this.nlpProcessor.segment(session, text);
 
			List<String> words = new ArrayList<String>();
			for(int i = 0; i < terms.size(); i++){
				Term term = terms.get(i);
				words.add(term.word);
			}
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("words", words.toArray());
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("segment", "标准分词失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	} 
}
