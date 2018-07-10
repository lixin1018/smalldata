package com.novacloud.novaone.dataFile.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject; 
import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dataFile.DataFileProcessor;
import com.novacloud.novaone.dataFile.FileUseType;
import com.novacloud.novaone.dataFile.RootDirType;
import com.novacloud.novaone.dataFile.webExcel.WebExcelFileProcessor;
import com.novacloud.novaone.excelGrid.definition.ExcelGridProcessor;
import com.opensymphony.xwork2.ActionSupport;
  
 //数据文件服务
public interface IFileBaseService {  
	String saveFile();   
	String readFile();  
}
