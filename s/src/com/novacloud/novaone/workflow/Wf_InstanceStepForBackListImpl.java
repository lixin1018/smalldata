package com.novacloud.novaone.workflow;
 
import net.sf.json.JSONArray;
import net.sf.json.JSONObject; 
import java.util.HashMap; 
import com.novacloud.novaone.common.INcpSession; 
import com.novacloud.novaone.dao.sys.DataBaseDao; 
import com.novacloud.novaone.workflow.definition.StepStatusType;

//可退回节点Dao类
public class Wf_InstanceStepForBackListImpl extends DataBaseDao {		
	
	@Override
	protected void afterSelect(INcpSession session, JSONObject requestObj, HashMap<String,Object> resultHash) throws Exception{
		JSONArray rows = (JSONArray)((HashMap)resultHash.get("table")).get("rows");

		for(int i=0;i<rows.size();i++){
			JSONObject stepRow = rows.getJSONObject(i);
			StepStatusType statusType  = (StepStatusType)Enum.valueOf(StepStatusType.class,stepRow.getString("statustype"));
			if(statusType == StepStatusType.active || statusType == StepStatusType.suspended) {
				boolean canBackFrom = "Y".equals(stepRow.getString("canbackfrom"));
				if(!canBackFrom){
					rows.clear();
				}
			}
		}
		 
		JSONArray canBackToStepRows = new JSONArray();
		for(int i=0;i<rows.size();i++){
			JSONObject stepRow = rows.getJSONObject(i);
			StepStatusType statusType  = (StepStatusType)Enum.valueOf(StepStatusType.class,stepRow.getString("statustype")); 
			if(statusType == StepStatusType.passed){
				boolean canBackFrom = "Y".equals(stepRow.getString("canbackfrom"));
				boolean canBackTo = "Y".equals(stepRow.getString("canbackto"));
				if(canBackTo){
					canBackToStepRows.add(stepRow);
					if(!canBackFrom){
						break;
					}
				}
				else{
					break;
				}				
			}
		}
		
		((HashMap)resultHash.get("table")).put("rows", canBackToStepRows);		
	}	
}
