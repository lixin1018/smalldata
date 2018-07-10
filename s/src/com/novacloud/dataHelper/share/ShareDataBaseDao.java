package com.novacloud.dataHelper.share;

import java.util.Date;
import java.util.HashMap;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.dao.sys.DataBaseDao;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class ShareDataBaseDao extends DataBaseDao {
	private long minRequestSpanMillisecond = 500;
	
	//如果连续查询多个，那么禁止查询一段时间
	@Override
	protected void beforeSelect(INcpSession session, JSONObject requestObj) throws Exception{
		JSONArray orderByJsonArray = requestObj.getJSONArray("orderby");
		if(orderByJsonArray == null || orderByJsonArray.size() == 0){
			JSONObject createTimeJson = new JSONObject();
			createTimeJson.put("name", "createtime");
			createTimeJson.put("direction", "asc"); 
			
			if(orderByJsonArray == null){
				orderByJsonArray = new JSONArray();
			}
			orderByJsonArray.add(createTimeJson);
			requestObj.put("orderby", orderByJsonArray);
		}
		if(!this.checkLashResquest(session)){
			throw new NcpException("selectData_tooManyRequest", "操作过于频繁, 请稍后再试.");
		}
	}
	
	private static HashMap<String, Date> userLastRequestTimes = new HashMap<String, Date>();
	
	private boolean checkLashResquest(INcpSession session){
		String userId = session.getUserId();
		Date nowTime = new Date();

		synchronized(this){
			if(userLastRequestTimes.containsKey(userId)){
				Date lastTime = userLastRequestTimes.get(userId);
				long spanMillisecond = nowTime.getTime() - lastTime.getTime();
				if(minRequestSpanMillisecond > spanMillisecond){
					return false;
				}
				else{
					userLastRequestTimes.put(userId, nowTime);
				}
			}
			else{
				userLastRequestTimes.put(userId, nowTime);
			}
			return true;
		}
	} 
}
