package com.novacloud.novaone.dao.system.impl;
 
import java.util.HashMap;

import net.sf.json.JSONObject;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.dao.sys.DataBaseDao;
import com.novacloud.novaone.dao.system.Sys_DataPurviewFactor;

public class Sys_DataPurviewFactorImpl extends DataBaseDao implements Sys_DataPurviewFactor { 
	@Override
	protected void afterSave(INcpSession session, JSONObject requestObj, HashMap<String,Object> resultHash) throws Exception{
	}
}
