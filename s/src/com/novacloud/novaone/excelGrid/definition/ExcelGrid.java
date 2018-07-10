package com.novacloud.novaone.excelGrid.definition;

import java.beans.Beans;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.util.CellRangeAddress;

import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.excelGrid.expression.definition.CellReferanceInfo;
import com.novacloud.novaone.excelGrid.expression.definition.CellReferanceNode;
import com.novacloud.novaone.excelGrid.expression.definition.CellReferanceSourceType;
import com.novacloud.novaone.excelGrid.expression.definition.Columns;
import com.novacloud.novaone.excelGrid.expression.definition.ExpCommonValueType;
import com.novacloud.novaone.excelGrid.expression.definition.ExpTreePart;
import com.novacloud.novaone.excelGrid.expression.definition.PartType;
import com.novacloud.novaone.excelGrid.expression.definition.Rows;
import com.novacloud.novaone.excelGrid.expression.definition.RunAt;
import com.novacloud.novaone.excelGrid.expression.definition.Sheets;
import com.novacloud.novaone.excelGrid.expression.definition.Validator;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class ExcelGrid { 
	private int defaultColumnWidth = 80;
	private int defaultRowHeight = 20;
	//显示网格线
	private boolean hasGridLine = true;	
	//显示编辑栏
	private boolean hasEditBar = true;	
	//显示行列标题
	private boolean hasColumnRowTitle = true;
	//显示Sheet标题
	private boolean hasSheetTitle = true;
	//显示Page标题
	private boolean hasPageTitle = true;
	
	public int getDefaultColumnWidth(){
		return this.defaultColumnWidth;
	}
	public void setDefaultColumnWidth(int defaultColumnWidth){
		this.defaultColumnWidth = defaultColumnWidth;
	}
	
	public int getDefaultRowHeight(){
		return this.defaultRowHeight;
	}
	public void setDefaultRowHeight(int defaultRowHeight){
		this.defaultRowHeight = defaultRowHeight;
	}	
	public boolean getHasGridLine() {
		return hasGridLine;
	}
	public void setHasGridLine(boolean hasGridLine) {
		this.hasGridLine = hasGridLine;
	}
	public boolean getHasEditBar() {
		return hasEditBar;
	}
	public void setHasEditBar(boolean hasEditBar) {
		this.hasEditBar = hasEditBar;
	}
	public boolean getHasColumnRowTitle() {
		return hasColumnRowTitle;
	}
	public void setHasColumnRowTitle(boolean hasColumnRowTitle) {
		this.hasColumnRowTitle = hasColumnRowTitle;
	}
	public boolean getHasSheetTitle() {
		return hasSheetTitle;
	}
	public void setHasSheetTitle(boolean hasSheetTitle) {
		this.hasSheetTitle = hasSheetTitle;
	}
	public boolean getHasPageTitle() {
		return hasPageTitle;
	}
	public void setHasPageTitle(boolean hasPageTitle) {
		this.hasPageTitle = hasPageTitle;
	}
	
	private HashMap<String, ExcelGridSheet> allSheets = null;
	public HashMap<String, ExcelGridSheet> getAllSheets() {
		return allSheets;
	}
	public void setAllSheets(HashMap<String, ExcelGridSheet> allSheets) {
		this.allSheets = allSheets;
	}
	
	//所有单元格
	private HashMap<String, ExcelGridCell> allCells = null; 
	public HashMap<String, ExcelGridCell> getAllCells() {
		return allCells;
	}
	public void setAllCells(HashMap<String, ExcelGridCell> allCells) {
		this.allCells = allCells;
	}
	
	private boolean checkHasSheetByName(String sheetName){
		HashMap<String, ExcelGridSheet> sheets = this.getAllSheets();
		for(String sheetId : sheets.keySet()){ 
			ExcelGridSheet sheet = sheets.get(sheetId);
			if(sheetName.equals(sheet.getName())){
				return true;
			}
		}
		return false;
	}
	
	private int getMaxSheetIndex(){
		int maxIndex = -1;
		for(String sheetId : this.allSheets.keySet()){
			ExcelGridSheet sheet = this.allSheets.get(sheetId);
			if(sheet.getIndex() > maxIndex){
				maxIndex = sheet.getIndex();
			}
		}
		return maxIndex++;
	}

	public void addBlankExcelGridSheet(int defaultRowCount, int defaultColumnCount, int defaultRowHeight, int defaultColumnWidth){
		String sheetId = UUID.randomUUID().toString();
		int namePostfix = 1;
		String namePrefix = "Sheet";
		String sheetName = namePrefix + namePostfix;
		if(this.checkHasSheetByName(sheetName)){
			namePostfix++; 
			sheetName = namePrefix + namePostfix;
		}
		
		int sheetIndex = this.getMaxSheetIndex();
		ExcelGridSheet egs = new ExcelGridSheet(sheetId, sheetName, sheetIndex);
		this.allSheets.put(sheetId, egs);
		
		List<ExcelGridRow> egRows = new ArrayList<ExcelGridRow>();
		egs.setAllRows(egRows);
		for(int i = 0; i < defaultRowCount; i++){
			ExcelGridRow egRow = new ExcelGridRow();
			egRows.add(egRow);
			
			String rowId = UUID.randomUUID().toString();
			egRow.setId(rowId);
			
			egRow.setSheetId(sheetId);			
			egRow.setHeight(defaultRowHeight);		
		}

		List<ExcelGridColumn> egCols = new ArrayList<ExcelGridColumn>();
		egs.setAllColumns(egCols);
		for(int i = 0; i < defaultColumnCount; i++){ 
			ExcelGridColumn egCol = new ExcelGridColumn();
			egCols.add(egCol);
			
			String colId = UUID.randomUUID().toString();
			egCol.setId(colId);

			egCol.setSheetId(sheetId);	
			egCol.setWidth(defaultColumnWidth);		
		}

		HashMap<String, ExcelGridCell> egCells = this.getAllCells();
		
		for(int i = 0; i < defaultRowCount; i++){ 
			ExcelGridRow egRow = egRows.get(i);
			String rowId = egRow.getId();
			for(int j = 0; j < defaultColumnCount; j++){ 
				ExcelGridColumn egCol = egCols.get(j);
				String colId = egCol.getId();
				String cellId = sheetId + "_" + colId + "_" + rowId; 
				ExcelGridCell egCell = new ExcelGridCell();
				egCell.setId(cellId); 
				egCell.setRowId(rowId);
				egCell.setSheetId(sheetId);
				egCell.setColumnId(colId); 
				egCells.put(cellId, egCell);				 
			}				
		}
	}


	public static ExcelGrid createNewExcelGrid(int defaultRowCount, int defaultColumnCount, int defaultRowHeight, int defaultColumnWidth){
		ExcelGrid eg = new ExcelGrid();
		HashMap<String, ExcelGridSheet> egSheets = new HashMap<String, ExcelGridSheet>();
		eg.setAllSheets(egSheets); 
 
		HashMap<String, ExcelGridCell> egCells = new HashMap<String, ExcelGridCell>();
		eg.setAllCells(egCells); 
		
		eg.addBlankExcelGridSheet(defaultRowCount, defaultColumnCount, defaultRowHeight, defaultColumnWidth); 		
		
		return eg;
	}

	public static ExcelGrid createBlankExcelGrid(){
		ExcelGrid eg = new ExcelGrid();
		HashMap<String, ExcelGridSheet> egSheets = new HashMap<String, ExcelGridSheet>();
		eg.setAllSheets(egSheets); 
 
		HashMap<String, ExcelGridCell> egCells = new HashMap<String, ExcelGridCell>();
		eg.setAllCells(egCells); 
		
		return eg;
	}
	
	public JSONObject toJson() throws Exception{
		JSONObject egJsonObj = new JSONObject();
		egJsonObj.put("dcw", this.getDefaultColumnWidth());
		egJsonObj.put("drh", this.getDefaultRowHeight());

		egJsonObj.put("hgl", this.getHasGridLine() ? "Y" : "N");
		egJsonObj.put("heb", this.getHasEditBar() ? "Y" : "N");
		egJsonObj.put("hcrt", this.getHasColumnRowTitle() ? "Y" : "N");
		egJsonObj.put("hst", this.getHasSheetTitle() ? "Y" : "N");
		egJsonObj.put("hpt", this.getHasPageTitle() ? "Y" : "N");
		
		Sheets sheets = new Sheets(this.getAllSheets());

		JSONObject allSheetObjs = new JSONObject();
		HashMap<String, ExcelGridSheet> allSheets = this.getAllSheets(); 
		for(String sheetId : this.allSheets.keySet()){			
			ExcelGridSheet sheet = allSheets.get(sheetId);
			JSONObject sheetJsonObj = new JSONObject();
			//sheetJsonObj.put("id", sheet.getId());
			sheetJsonObj.put("n", sheet.getName()); 
			sheetJsonObj.put("i", sheet.getIndex());
			int sheetIndex = sheet.getIndex();

			Columns columns = sheets.getColumns(sheetId);
			Rows rows = sheets.getRows(sheetId);
			
			JSONArray allColumnObjArray = new JSONArray();
			List<ExcelGridColumn> allColumns = sheet.getAllColumns();
			int columnCount = allColumns.size();
			for(int i = 0; i < columnCount; i++){
				ExcelGridColumn col = allColumns.get(i);
				JSONObject colJsonObj = new JSONObject();
				colJsonObj.put("id", col.getId());
				//colJsonObj.put("sheetId", col.getSheetId());
				colJsonObj.put("f", col.getIsFrozen());
				colJsonObj.put("w", col.getWidth());
				String columnName = columns.getColumnNameById(col.getId());
				colJsonObj.put("n", columnName);
				allColumnObjArray.add(colJsonObj);				
			}
			sheetJsonObj.put("allColumns", allColumnObjArray);
			
			JSONArray allRowObjArray = new JSONArray();
			List<ExcelGridRow> allRows = sheet.getAllRows();
			int rowCount = allRows.size();
			for(int i = 0; i < rowCount; i++){
				ExcelGridRow row = allRows.get(i);
				JSONObject rowJsonObj = new JSONObject();
				rowJsonObj.put("id", row.getId());
				//rowJsonObj.put("sheetId", row.getSheetId());
				rowJsonObj.put("f", row.getIsFrozen());
				rowJsonObj.put("h", row.getHeight());
				String rowName = rows.getRowNameById(row.getId());
				rowJsonObj.put("n", rowName);
				
				allRowObjArray.add(rowJsonObj);
			}
			sheetJsonObj.put("allRows", allRowObjArray);

			allSheetObjs.put(sheet.getId(), sheetJsonObj);			
		}
		egJsonObj.put("allSheets", allSheetObjs);
		
		HashMap<String, ExcelGridCell> allCells = this.getAllCells();
		Set<String> allCellIds = allCells.keySet();
		JSONObject allCellJsonObj = new JSONObject();
		for(String cellId : allCellIds){
			JSONObject cellJsonObj = new JSONObject();
			ExcelGridCell cell = allCells.get(cellId);
			if(!cell.IsBlankCell()){
				try{	
					String sheetId = cell.getSheetId();
					ExcelGridSheet sheet = allSheets.get(sheetId);
					Columns columns = sheets.getColumns(sheetId);
					Rows rows = sheets.getRows(sheetId);
					cellJsonObj.put("si", sheet.getIndex());
					String columnName = columns.getColumnNameById(cell.getColumnId());
					cellJsonObj.put("cn", columnName); 
					String rowName = rows.getRowNameById(cell.getRowId());
					cellJsonObj.put("rn", rowName);
					
					if(cell.getCellShowType() != CellShowType.Text){
						cellJsonObj.put("st", ExcelGridCell.toSimpleShowType(cell.getCellShowType()));
					}
					if(cell.getCellValueType() != ValueType.String){
						cellJsonObj.put("vt", ExcelGridCell.toSimpleValueType(cell.getCellValueType()));	
					}
					if(cell.getColSpan() != 1){
						cellJsonObj.put("cs", cell.getColSpan());
					}
					if(!cell.getFormatString().isEmpty()){
						cellJsonObj.put("fs", CommonFunction.encode(cell.getFormatString()));
					}
					if(cell.getGroupCellId() != null && cell.getGroupCellId() != cell.getId()){
						cellJsonObj.put("gid", cell.getGroupCellId());
					}
					if(cell.getRowSpan() != 1){
						cellJsonObj.put("rs", cell.getRowSpan());
					}
					
					Object value = cell.getValue();
					String valueStr = ValueConverter.convertToString(value, cell.getCellValueType());
					
					if(valueStr != null && !valueStr.isEmpty()){
						cellJsonObj.put("v", CommonFunction.encode(valueStr));
					}
					if(cell.getExpression() != null && !cell.getExpression().isEmpty()){
						cellJsonObj.put("x", CommonFunction.encode(cell.getExpression()));
					}
					if(cell.getIsExp()){
						cellJsonObj.put("ix", cell.getIsExp() ? "Y" : "N");
					}
		 
					if(cell.getIsError()){
						cellJsonObj.put("er", cell.getIsError() ? "Y" : "N");
					}
					
					if(cell.getNote() != null && !cell.getNote().isEmpty()){
						cellJsonObj.put("nt", CommonFunction.encode(cell.getNote()));
					}
					
					if(cell.getCssStyle() != null){
						cellJsonObj.put("css", cell.getCssStyle().toJson());
					}					
										
					String cellFullName = sheet.getIndex() + columnName + rowName;
					/*
					String[] effectIdArray = cell.getEffectCellIdArray();
					if(effectIdArray != null){
						cellJsonObj.put("effectCellIds", effectIdArray);
					}
					*/
					allCellJsonObj.put(cellFullName, cellJsonObj); 
				}
				catch(Exception ex){
					throw ex;
				}
			}
		}
		egJsonObj.put("allCells", allCellJsonObj);
		return egJsonObj;
	}
	
	public static ExcelGrid fromJson(JSONObject jsonObj) throws Exception{		
		ExcelGrid eg = new ExcelGrid();
				
		int defaultColumnWidth = jsonObj.getInt("dcw");
		eg.setDefaultColumnWidth(defaultColumnWidth);
		int defaultRowHeight = jsonObj.getInt("drh");
		eg.setDefaultRowHeight(defaultRowHeight);

		boolean hasGridLine = !jsonObj.containsKey("hgl") ? true : jsonObj.getString("hgl").equals("Y");
		eg.setHasGridLine(hasGridLine);
		boolean hasEditBar = !jsonObj.containsKey("heb") ? true : jsonObj.getString("heb").equals("Y");
		eg.setHasEditBar(hasEditBar);
		boolean hasSheetTitle = !jsonObj.containsKey("hst") ? true : jsonObj.getString("hst").equals("Y");
		eg.setHasSheetTitle(hasSheetTitle);
		boolean hasColumnRowTitle = !jsonObj.containsKey("hcrt") ? true : jsonObj.getString("hcrt").equals("Y");
		eg.setHasColumnRowTitle(hasColumnRowTitle);
		boolean hasPageTitle = !jsonObj.containsKey("hpt") ? true : jsonObj.getString("hpt").equals("Y");
		eg.setHasPageTitle(hasPageTitle);
		

		JSONObject allSheetJson = jsonObj.getJSONObject("allSheets"); 
		HashMap<String, ExcelGridSheet> allSheets = new HashMap<String, ExcelGridSheet>();
		HashMap<Integer, String> sheetIndexToId = new HashMap<Integer, String>();
		HashMap<String, HashMap<String, String>> sheetIdToColumnNameId = new HashMap<String, HashMap<String, String>>();
		HashMap<String, HashMap<String, String>> sheetIdToRowNameId = new HashMap<String, HashMap<String, String>>();
		
		for(Object sheetIdObj : allSheetJson.keySet()){ 	
			String sheetId = sheetIdObj.toString(); 
			JSONObject sheetJson = allSheetJson.getJSONObject(sheetId);
			String sheetName = sheetJson.getString("n"); 	
			int sheetIndex = sheetJson.getInt("i"); 	
			sheetIndexToId.put(sheetIndex, sheetId);
			
			ExcelGridSheet sheet = new ExcelGridSheet(sheetId, sheetName, sheetIndex);
			allSheets.put(sheetId, sheet);
			HashMap<String, String> columnNameToId = new HashMap<String, String>();
			HashMap<String, String> rowNameToId = new HashMap<String, String>();
			sheetIdToColumnNameId.put(sheetId, columnNameToId);
			sheetIdToRowNameId.put(sheetId, rowNameToId);
			
			JSONArray allColumnJsonArray = sheetJson.getJSONArray("allColumns");
			int columnCount = allColumnJsonArray.size();
			List<ExcelGridColumn> allColumns = new ArrayList<ExcelGridColumn>();
			for(int i = 0; i < columnCount; i++){
				ExcelGridColumn col = new ExcelGridColumn();
				JSONObject columnJson = allColumnJsonArray.getJSONObject(i);
				
				String id = columnJson.getString("id");
				col.setId(id);
				col.setSheetId(sheetId);
				
				boolean isFrozen = columnJson.getBoolean("f");
				col.setIsFrozen(isFrozen);
				
				int width = columnJson.getInt("w");
				col.setWidth(width);
				
				String columnName = columnJson.getString("n");
				columnNameToId.put(columnName, id);

				allColumns.add(col);
			}
			sheet.setAllColumns(allColumns);
			
			JSONArray allRowJsonArray = sheetJson.getJSONArray("allRows"); 
			int rowCount = allRowJsonArray.size();
			List<ExcelGridRow> allRows = new ArrayList<ExcelGridRow>();
			for(int i = 0; i < rowCount; i++){
				ExcelGridRow row = new ExcelGridRow();
				JSONObject rowJson = allRowJsonArray.getJSONObject(i);

				String id = rowJson.getString("id");
				row.setId(id); 
				row.setSheetId(sheetId);
				
				boolean isFrozen = rowJson.getBoolean("f");
				row.setIsFrozen(isFrozen);
				
				int height = rowJson.getInt("h");
				row.setHeight(height);
				
				String rowName = rowJson.getString("n");
				rowNameToId.put(rowName, id);
				
				allRows.add(row);
			}
			sheet.setAllRows(allRows);
		}
		eg.setAllSheets(allSheets);
		
		//构造所有的单元格
		HashMap<String, ExcelGridCell> allCells = new HashMap<String, ExcelGridCell>();
		for(String sheetId : allSheets.keySet()){
			ExcelGridSheet sheet = allSheets.get(sheetId);
			List<ExcelGridColumn> columns = sheet.getAllColumns();
			List<ExcelGridRow> rows = sheet.getAllRows();
			for(ExcelGridColumn column : columns){
				String colId = column.getId();
				for(ExcelGridRow row : rows){					
					String rowId = row.getId();
					String cellId = sheetId + "_" + colId + "_" + rowId; 
					ExcelGridCell cell = new ExcelGridCell();
					cell.setId(cellId);				
					cell.setSheetId(sheetId); 
					cell.setRowId(rowId);
					cell.setColumnId(colId); 	
					allCells.put(cellId, cell);
				}
			}
		}
		eg.setAllCells(allCells);
		
		JSONObject allCellJsonObj = jsonObj.getJSONObject("allCells");		
		Set<String> allCellFullNames = allCellJsonObj.keySet();
		for(String allCellFullName : allCellFullNames){
			JSONObject cellJsonObj = allCellJsonObj.getJSONObject(allCellFullName);
			int sheetIndex = cellJsonObj.getInt("si");
			String sheetId = sheetIndexToId.get(sheetIndex);
			HashMap<String, String> columnNameToIds = sheetIdToColumnNameId.get(sheetId);
			HashMap<String, String> rowNameToIds = sheetIdToRowNameId.get(sheetId);
			String rowName = cellJsonObj.getString("rn");
			String rowId = rowNameToIds.get(rowName);
			String columnName = cellJsonObj.getString("cn"); 
			String columnId = columnNameToIds.get(columnName);
			
			String cellId = sheetId + "_" + columnId + "_" + rowId; 
			ExcelGridCell cell = allCells.get(cellId);

			
			CellShowType cellShowType = !cellJsonObj.containsKey("st") ? CellShowType.Text : ExcelGridCell.toFullShowType(cellJsonObj.getString("st"));
			cell.setCellShowType(cellShowType);
			
			ValueType cellValueType = !cellJsonObj.containsKey("vt") ? ValueType.String : ExcelGridCell.toFullValueType(cellJsonObj.getString("vt"));
			cell.setCellValueType(cellValueType);
			
			int colSpan = !cellJsonObj.containsKey("cs") ? 1 : cellJsonObj.getInt("cs");
			cell.setColSpan(colSpan);
			
			int rowSpan =  !cellJsonObj.containsKey("rs") ? 1 :cellJsonObj.getInt("rs");
			cell.setRowSpan(rowSpan);
			
			String formatString = !cellJsonObj.containsKey("fs") ? "" : CommonFunction.decode(cellJsonObj.getString("fs"));
			cell.setFormatString(formatString);
			
			String groupCellId = !cellJsonObj.containsKey("gid") ? null : cellJsonObj.getString("gid");
			cell.setGroupCellId(groupCellId);
			
			cell.setSheetId(sheetId);
			
			cell.setRowId(rowId);

			cell.setColumnId(columnId); 
			
			String valueStr = !cellJsonObj.containsKey("v") ? "" : CommonFunction.decode(cellJsonObj.getString("v"));
			
			Object value = ExpCommonValueType.convertToObject(valueStr, cellValueType);	
			cell.setValue(value);

			String expression = !cellJsonObj.containsKey("x") ? "" :  CommonFunction.decode(cellJsonObj.getString("x"));
			cell.setExpression(expression);

			boolean isExp = !cellJsonObj.containsKey("ix") ? false :  cellJsonObj.getString("ix").equals("Y");
			cell.setIsExp(isExp); 
			
			if(cellJsonObj.containsKey("css")){
				cell.setCssStyle(ExcelGridCssStyle.fromJson(cellJsonObj.getJSONObject("css")));
			}
			
			/*
			JSONArray effectCellIdsArray = !cellJsonObj.containsKey("effectCellIds") ? null : cellJsonObj.getJSONArray("effectCellIds");
			if(effectCellIdsArray != null){
				List<String> effectCellIds = new ArrayList<String>();
				for(int i = 0; i < effectCellIdsArray.size(); i++){
					effectCellIds.add(effectCellIdsArray.getString(i));
				}
				cell.setEffectCellIds(effectCellIds);
			}
			*/
		}
		
		return eg;
	}
		
	public static CellShowType getShowTypeByName(String showTypeStr) throws Exception{
		String showTypeStrLower =  showTypeStr.toLowerCase();
		switch(showTypeStrLower){
			case "htmlelement":
				return CellShowType.HtmlElement;
			case "link":
				return CellShowType.Link;
			case "text":
				return CellShowType.Text;
			default:
				throw new Exception("Unknown cell show type. CellShowType = " + showTypeStrLower);
		}
	}
	
	/*
	//记录下每个单元格的变化，影响了哪些单元格
	public void setCellEffects(HashMap<String, CellReferanceNode> cellIdToCellReferNodes) throws Exception{ 
		for(String cellId : cellIdToCellReferNodes.keySet()){
			CellReferanceNode refNode = cellIdToCellReferNodes.get(cellId);
	 		this.setCellEffects(cellId, refNode);	 		
		}
	}
	
	public void setCellEffects(String destCellId, CellReferanceNode refNode) throws Exception{   
		for(String refCellId : refNode.getReferCellIds().keySet()){
			this.setCellEffects(destCellId, refCellId);
		}
	}
	
	public void setCellEffects(String destCellId, String refCellId){
 		ExcelGridCell cell = this.allCells.get(refCellId); 
 		cell.addEffectCellId(destCellId);
	}
	*/
	
	public ExcelGridValidateResult validate() throws Exception{
   
		HashMap<String, ValueType> cellValueTypes = new HashMap<String, ValueType>();
	 	for(String cellId : this.allCells.keySet()){ 
	 		ExcelGridCell cell = this.allCells.get(cellId); 
			cellValueTypes.put(cellId, cell.getCellValueType());
	 	}
	 	
		Sheets sheets = new Sheets(this.getAllSheets());		

		HashMap<String, List<ExpTreePart>> cellIdToExpParts = new HashMap<String, List<ExpTreePart>>();
		HashMap<String, ExpTreePart> cellIdToRootParts = new HashMap<String, ExpTreePart>();
		HashMap<String, CellReferanceNode> cellIdToCellReferNodes = new HashMap<String, CellReferanceNode>();
		
		Validator vd = (Validator)ContextUtil.getBean("egExpValidator");
		for(String cellId : this.allCells.keySet()){
			ExcelGridCell cell = this.allCells.get(cellId);
			String sheetId = cell.getSheetId();
			
			if(cell.getIsExp()){
				String exp = cell.getExpression().substring(1); 
				List<ExpTreePart> expParts = vd.getExpTreeParts(exp, cellValueTypes, sheetId, sheets);
				cellIdToExpParts.put(cellId, expParts);
								
				CellReferanceNode referNode = new CellReferanceNode();
				cellIdToCellReferNodes.put(cellId, referNode);
				referNode.setCellId(cellId);
				for(ExpTreePart expPart : expParts){
					if(expPart.getPartType() == PartType.CellReferance){
						String refSheetId = sheetId;
						if(expPart.getCellReferSourceType() == CellReferanceSourceType.RemoteSheet){
							refSheetId = expPart.getCellReferSheetId();
						}

						Columns columns = sheets.getColumns(refSheetId);
						Rows rows = sheets.getRows(refSheetId);
						CellReferanceInfo cellRefInfo = expPart.getCellRefInfo();
						String refCellId = refSheetId + "_" + cellRefInfo.getColId() + "_" + cellRefInfo.getRowId();
						referNode.getReferCellIds().put(refCellId, ""); 
					}
					else if(expPart.getPartType() == PartType.RangeReferance){
						String refSheetId = sheetId;
						if(expPart.getCellReferSourceType() == CellReferanceSourceType.RemoteSheet){
							refSheetId = expPart.getCellReferSheetId();
						} 
						Columns columns = sheets.getColumns(refSheetId);
						Rows rows = sheets.getRows(refSheetId);
						CellReferanceInfo fromCellRefInfo = expPart.getFromCellRefInfo();
						CellReferanceInfo toCellRefInfo = expPart.getToCellRefInfo();
						String fromColId = fromCellRefInfo.getColId();
						String fromRowId = fromCellRefInfo.getRowId();
						String toColId = toCellRefInfo.getColId();
						String toRowId = toCellRefInfo.getRowId();
						
						int fromColIndex = fromColId.length() == 0 ? 0 : columns.getColumnIndex(fromColId); 
						int toColIndex = toColId.length() == 0 ? columns.size() - 1 : columns.getColumnIndex(toColId);

						int fromRowIndex = fromRowId.length() == 0 ? 0: rows.getRowIndex(fromRowId);
						int toRowIndex = toRowId.length() == 0 ? rows.size() - 1 : rows.getRowIndex(toRowId); 
						
						if(toColIndex < fromColIndex){
							int tempColIndex = toColIndex;
							toColIndex = fromColIndex;
							fromColIndex = tempColIndex;
						}
						if(toRowIndex < fromRowIndex){
							int tempRowIndex = toRowIndex;
							toRowIndex = fromRowIndex;
							fromRowIndex = tempRowIndex;
						}
						for(int colIndex = fromColIndex; colIndex <= toColIndex; colIndex++){
							for(int rowIndex = fromRowIndex; rowIndex <= toRowIndex; rowIndex++){
								String colId = columns.getColumnId(colIndex);
								String rowId = rows.getRowId(rowIndex);
								String refCellId = refSheetId + "_" + colId + "_" + rowId;
								referNode.getReferCellIds().put(refCellId, "");
							}	
						}  
					}
				}
			}
		}

		HashMap<String, CellReferanceNode> cellIdToCellReferNodesForEffect = new HashMap<String, CellReferanceNode>();
		if(cellIdToCellReferNodes.size() > 0){
			for(String cellId : cellIdToCellReferNodes.keySet()){
				CellReferanceNode refNode = cellIdToCellReferNodes.get(cellId);
				CellReferanceNode refNodeForEffect = new CellReferanceNode();
				cellIdToCellReferNodesForEffect.put(cellId, refNodeForEffect);
				refNodeForEffect.setCellId(cellId);
				
				for(String refCellId : refNode.getReferCellIds().keySet()){
					refNodeForEffect.getReferCellIds().put(refCellId, "");
				}
			}
		}
		
		List<String> waitingCheckExpCellIds = new ArrayList<String>();
		
		//先遍历所有的不含表达式的节点，去掉各个表达式单元格对应的引用情况，并去除引用记录，然后再遍历所有的cellIdToCellReferNodes，去掉不包含引用的；然后再生育的节点中，去掉对刚刚被去除节点的引用，当发现去除掉的节点为0，但是cellIdToCellReferNodes还有剩余，那么说明出现了循环引用
		List<String> noneExpNodeIds =  this.getNoneExpNodeIds();
		this.getNoneSameSheetReferNodeIds(cellIdToCellReferNodes, noneExpNodeIds, waitingCheckExpCellIds);
		if(cellIdToCellReferNodes.size() > 0){
			//存在循环引用
			StringBuilder sb = new StringBuilder("存在单元格循环引用, 包括: ");
			for(String cellId : cellIdToCellReferNodes.keySet()){
				ExcelGridCell cell = this.allCells.get(cellId);
				String sheetId = cell.getSheetId();
				Columns columns = sheets.getColumns(sheetId);
				Rows rows = sheets.getRows(sheetId);
				String sheetName = sheets.getSheetNameById(sheetId);
				String colId = cell.getColumnId();
				String rowId = cell.getRowId();
				String colName = columns.getColumnNameById(colId);
				String rowName = rows.getRowNameById(rowId);
				sb.append(sheetName + "." + colName + rowName + ";");
			}
			
			throw new Exception(sb.toString());
		} 
		
		//验证表达式语法是否正确
		List<String> errors = new ArrayList<String>();
		for(String cellId : waitingCheckExpCellIds){
			ExcelGridCell cell = this.allCells.get(cellId);
			String sheetId = cell.getSheetId();
			List<ExpTreePart> expParts = cellIdToExpParts.get(cellId);
			try{
				ExpTreePart rootPart = vd.getRootPart(expParts, cellValueTypes, null, RunAt.All, sheetId, sheets);	
				cellIdToRootParts.put(cellId, rootPart);
				String error = this.validateExp(vd, cellId, rootPart, cellValueTypes, sheetId, sheets);
				if(error != null){
					errors.add(error);
				}
			}
			catch(Exception ex){
				errors.add(ex.getMessage());
			}
		}
		
		ExcelGridValidateResult vr = new ExcelGridValidateResult();
		vr.setError(ValueConverter.arrayToString(errors, "\r\n"));
		vr.setAllCellRootParts(cellIdToRootParts);
		vr.setCalcCellList(waitingCheckExpCellIds);
		vr.setSheets(sheets);
		
		if(vr.getSucceed()){
			//this.setCellEffects(cellIdToCellReferNodesForEffect);

			for(String cellId : cellIdToRootParts.keySet()){
				ExcelGridCell cell = this.allCells.get(cellId);
				ExpTreePart rootPart = cellIdToRootParts.get(cellId);  
				String jsCode = vd.toJsCode(rootPart);
				cell.setJsCode(jsCode);
			}
		}
		
		return vr;
	} 
	
	private String validateExp(Validator vd, String cellId, ExpTreePart rootPart, HashMap<String, ValueType> cellValueTypes, String sheetId, Sheets sheets){
		try{
			String resultValueTypeStr = vd.getExpResultValueType(rootPart, null);
			ValueType resultValueType = ValueConverter.getValueTypeByName(resultValueTypeStr);
			this.allCells.get(cellId).setCellValueType(resultValueType);
			cellValueTypes.put(cellId, resultValueType);
			return null;
		}
		catch(Exception ex){
			Columns columns = sheets.getColumns(sheetId);
			Rows rows = sheets.getRows(sheetId);
			String sheetName = sheets.getSheetNameById(sheetId);
			String cellName = this.getCellNameById(cellId, columns, rows);
			return sheetName + "." + cellName + ": " + ex.getMessage();
		}
	}
	
	private List<String> getNoneExpNodeIds(){
		List<String> noExpNodeIds = new ArrayList<String>();
		for(String cellId : this.allCells.keySet()){
			ExcelGridCell cell = this.allCells.get(cellId);
			if(!cell.getIsExp()){
				noExpNodeIds.add(cellId);
			}
		}
		return noExpNodeIds;
	}
	
	private String getCellNameById(String cellId, Columns columns, Rows rows){
		ExcelGridCell cell = this.allCells.get(cellId);
		String colId = cell.getColumnId();
		String rowId = cell.getRowId();
		String cellName = columns.getColumnNameById(colId) + rows.getRowNameById(rowId);
		return cellName;
	}
	
	//递归获取有没有形成循环引用
	private void getNoneSameSheetReferNodeIds(HashMap<String, CellReferanceNode> cellIdToCellReferNodes, List<String> needRemoveNodeIds, List<String> waitingCheckExpCellIds){
		List<String> noRefNodeIds = new ArrayList<String>();
		for(CellReferanceNode cellRefNode : cellIdToCellReferNodes.values()){
			for(String needRemoveNodeId : needRemoveNodeIds){
				if(cellRefNode.getReferCellIds().containsKey(needRemoveNodeId)){
					cellRefNode.getReferCellIds().remove(needRemoveNodeId);
				}
			}
			if(cellRefNode.getReferCellIds().size() == 0){
				noRefNodeIds.add(cellRefNode.getCellId());
				waitingCheckExpCellIds.add(cellRefNode.getCellId());
			}
		}
		for(String noRefNodeId : noRefNodeIds){
			cellIdToCellReferNodes.remove(noRefNodeId);
		}
		
		if(noRefNodeIds.size() > 0){
			this.getNoneSameSheetReferNodeIds(cellIdToCellReferNodes, noRefNodeIds, waitingCheckExpCellIds);
		} 
	}
}
