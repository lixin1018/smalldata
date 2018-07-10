package com.novacloud.novaone.dao.system.impl;
 
import java.util.HashMap;

import net.sf.json.JSONObject;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.dao.sys.DataBaseDao;
import com.novacloud.novaone.dao.system.D_RoleMenu;
import com.novacloud.novaone.model.sysmodel.PagePurviewHash;

public class D_RoleMenuImpl extends DataBaseDao  implements D_RoleMenu {

	private PagePurviewHash pagePurviewHash = null;
	public void setPagePurviewHash(PagePurviewHash pagePurviewHash){
		this.pagePurviewHash = pagePurviewHash;
	} 
	
	@Override
	protected void afterSave(INcpSession session, JSONObject requestObj, HashMap<String,Object> resultHash) throws Exception{
		pagePurviewHash.initFromDB();
	}
}
