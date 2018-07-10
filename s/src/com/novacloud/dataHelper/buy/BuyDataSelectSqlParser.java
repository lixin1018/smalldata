package com.novacloud.dataHelper.buy;

import com.novacloud.novaone.dao.db.SelectSqlParser;

public class BuyDataSelectSqlParser extends SelectSqlParser{
	public BuyDataSelectSqlParser(String sql) {
		super(sql); 
	}

	@Override
	public String getSelect(){
		return "t.id as id";		
	} 
	
	@Override
	protected void setSelect(String select) { 
	} 


	@Override

	//构造获取数据的sql
	public String getSql(String otherJoin, String otherWhere, String otherOrderby){	 
		return this.getSqlByParts(otherJoin, otherWhere, otherOrderby);
	}
}
