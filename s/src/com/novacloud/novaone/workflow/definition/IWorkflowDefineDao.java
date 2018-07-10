package com.novacloud.novaone.workflow.definition;

import java.sql.SQLException;
import java.util.HashMap;

import org.hibernate.Session;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.model.sysmodel.DataField;

import net.sf.json.JSONObject; 

public interface IWorkflowDefineDao { 
	void setDBSession(Session dbSession); 
	void deleteWorkflow(String workflowId) throws Exception;
	Wf_Workflow getWorkflow(String workflowId) throws Exception;
	String saveWorkflow(INcpSession ncpSession, Wf_Workflow newWorkflow) throws Exception; 
	HashMap<String, DataField> getDocFields(String docTypeId);
}
