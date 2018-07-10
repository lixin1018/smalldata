package com.novacloud.novaone.asynService;

import java.math.BigDecimal;
import java.util.HashMap;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.expression.run.IExternalBase;

public interface IAsynInvokeServiceProcessor extends IExternalBase {
	void asynInvoke(String serviceName) throws Exception;

	void checkAsynInvokeStatus(BigDecimal checkCount) throws Exception;

	String createAsynInvoke(String serviceId, String userId, String fromName, String fromId, HashMap<String, ValueType> parameterValueTypes, HashMap<String, Object> parameterValues) throws Exception;

}
