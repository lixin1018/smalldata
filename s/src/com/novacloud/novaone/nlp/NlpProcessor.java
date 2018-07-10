package com.novacloud.novaone.nlp;
 
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date; 
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID; 
import org.hibernate.Session;
import org.hibernate.Transaction;

import com.hankcs.hanlp.HanLP;
import com.hankcs.hanlp.seg.Segment;
import com.hankcs.hanlp.seg.common.Term;
import com.nova.frame.utils.SecurityUtils;
import com.novacloud.novaone.common.FileOperate;
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.common.util.CommonFunction; 
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType; 
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class NlpProcessor {
	 

	//执行数据库操作的通用类
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	private IDBParserAccess getDBParserAccess() {
		return this.dBParserAccess;
	} 
	
	//数据库Session（需要Service类里的方法把dbSession传递过来）
	private Session dbSession = null;
	protected Session getDBSession(){ 
		if(this.dbSession == null){
			throw new RuntimeException("none db session.");
		}
		return this.dbSession;
	} 
	public void setDBSession(Session dbSession){
		this.dbSession = dbSession;
	}
	public List<Term> segment(NcpSession session, String text) {
		Segment seg = HanLP.newSegment();
		seg.enableCustomDictionaryForcing(true);
		seg.enableCustomDictionary(true);
		List<Term> termList = seg.seg(text);
		return termList;
	}
	
}
