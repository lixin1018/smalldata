package com.novacloud.dataHelper.service;
 
import java.sql.SQLException;
import java.util.HashMap;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager; 
import com.novacloud.dataHelper.share.ShareViewProcessor; 
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException; 
import com.novacloud.novaone.common.ServiceResultProcessor;  
import com.opensymphony.xwork2.ActionSupport;
  
//更新数据共享的分类信息，这样编辑好的分类，就会更新到数据分享首页里 added by lixin 20180607
public class ShareViewService extends NcpActionSupport implements IShareViewService { 

	//事务管理器
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	
	//数据库Session
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	
	private ShareViewProcessor shareViewProcessor = null;
	public ShareViewProcessor getShareViewProcessor(){
		return this.shareViewProcessor;
	}
	public void setShareViewProcessor(ShareViewProcessor shareViewProcessor){
		this.shareViewProcessor = shareViewProcessor;
	}
	
	//更新数据共享的分类信息，这样编辑好的分类，就会更新到数据分享首页里
	@Override
	public String refreshShareDataCategory(){ 
		Session dbSession = null;
		try
		{
			dbSession = this.openDBSession();
			ShareViewProcessor shareViewProcessor = this.getShareViewProcessor();
			shareViewProcessor.setDBSession(dbSession); 
			shareViewProcessor.refreshCategoryInfo();
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		} 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("refreshShareDataCategoryError", "refreshShareDataCategory Error", ex);
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
