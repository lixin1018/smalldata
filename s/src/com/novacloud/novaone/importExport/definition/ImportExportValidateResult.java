package com.novacloud.novaone.importExport.definition;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.excelGrid.expression.definition.Columns;
import com.novacloud.novaone.excelGrid.expression.definition.ExpTreePart;
import com.novacloud.novaone.excelGrid.expression.definition.Rows;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

//表达式验证结果
public class ImportExportValidateResult extends ValidateResult{
	private Map<String, ExpTreePart> allCellRootParts = null;
	private List<String> calcCellList = null;
	private Columns columns = null;
	private Rows rows = null;

	public Map<String, ExpTreePart> getAllCellRootParts() {
		return allCellRootParts;
	}

	public void setAllCellRootParts(Map<String, ExpTreePart> allCellRootParts) {
		this.allCellRootParts = allCellRootParts;
	}

	public List<String> getCalcCellList() {
		return calcCellList;
	}

	public void setCalcCellList(List<String> calcCellList) {
		this.calcCellList = calcCellList;
	}

	public Columns getColumns() {
		return columns;
	}

	public void setColumns(Columns columns) {
		this.columns = columns;
	}

	public Rows getRows() {
		return rows;
	}

	public void setRows(Rows rows) {
		this.rows = rows;
	}
	
}
