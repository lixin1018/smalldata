package com.novacloud.novaone.excelGrid.expression.definition;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class CellReferanceNode {
	private String cellId;
	private HashMap<String, String> referCellIds = new HashMap<String, String>();
	public String getCellId() {
		return cellId;
	}
	public void setCellId(String cellId) {
		this.cellId = cellId;
	}
	public HashMap<String, String> getReferCellIds() {
		return referCellIds;
	}
	public void setReferCellIds(HashMap<String, String> referCellIds) {
		this.referCellIds = referCellIds;
	}
	
}
