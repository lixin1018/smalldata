package com.novacloud.novaone.excelGrid.definition;

import java.io.BufferedInputStream;
import java.io.Console;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import org.apache.poi.hssf.util.PaneInformation;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Color;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.FontFamily;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xssf.usermodel.extensions.XSSFCellBorder.BorderSide;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.ValueType;

public class ConvertExcelToExcelGridProcessor {	
	//允许导入的最大行数
	private int maxRowCount = 50000;
	public int getMaxRowCount() {
		return maxRowCount;
	}
	public void setMaxRowCount(int maxRowCount) {
		this.maxRowCount = maxRowCount;
	}
	
	//允许导入的最大列数
	private int maxColCount = 200;
	public int getMaxColCount() {
		return maxColCount;
	}
	public void setMaxColCount(int maxColCount) {
		this.maxColCount = maxColCount;
	}

	private List<String> validateExcelFile(XSSFSheet sheet){
		List<String> errors = new ArrayList<String>();
		int lastRowIndex = sheet.getLastRowNum();
		int lastColIndex = this.getLastColIndex(sheet);// sheet.getRow(0).getPhysicalNumberOfCells(); 
		if(lastRowIndex >= this.getMaxRowCount()){
			errors.add("行过多, 允许的最大行数为" + this.getMaxRowCount());
		}
		if(lastColIndex >= this.getMaxColCount()){
			errors.add("列过多, 允许的最大列数为" + this.getMaxColCount());
		}
		return errors;
	}
	
	//从Excel的sheet页中读取形成此值
	public ExcelGrid createExcelGridFromExcelFile(INcpSession session, String excelFilePath, List<String> sheetNames) throws Exception{
		XSSFWorkbook wb = this.getExcelWorkbookByFilePath(session, excelFilePath);
		ExcelGrid eg = ExcelGrid.createBlankExcelGrid();
		for(int i = 0; i < sheetNames.size(); i++){
			int sheetIndex = i;
			String sheetName = sheetNames.get(i);
			String sheetId = UUID.randomUUID().toString();
			XSSFSheet excelSheet = wb.getSheet(sheetName);		
			List<String> errors = this.validateExcelFile(excelSheet);
			if(errors.size() == 0){
				this.getExcelGridSheet(sheetId, sheetName, sheetIndex, wb, excelSheet, eg);
			}
			else{
				String errorStr = CommonFunction.listToString(errors, ";\r\n");
				throw new NcpException("validateAndGenerateByUploadExcel002", errorStr);
			}
		}
		return eg;
	} 
	
	private int getLastColIndex(XSSFSheet sheet){
		int maxLastColIndex = -1;
		int lastRowIndex = sheet.getLastRowNum();
		for(int i = 0; i <= lastRowIndex; i++){
			Row sheetRow = sheet.getRow(i);
			if(sheetRow != null){
				int lastColIndex = sheetRow.getLastCellNum() - 1;
				if(lastColIndex > maxLastColIndex){
					maxLastColIndex = lastColIndex;
				}
			}
		}
		return maxLastColIndex;
	}

	
	private ExcelGridSheet getExcelGridSheet(String sheetId, String sheetName, int sheetIndex, XSSFWorkbook wb, XSSFSheet sheet, ExcelGrid eg) throws Exception{
		int lastRowIndex = sheet.getLastRowNum();
		int lastColIndex = this.getLastColIndex(sheet); 
		if(lastColIndex == -1){
			//如果发现没有任何行列，那么默认10*10个空单元格
			lastRowIndex = 9;
			lastColIndex = 9;
		}
		ExcelGridSheet egs = new ExcelGridSheet(sheetId, sheetName, sheetIndex);
		eg.getAllSheets().put(sheetId, egs);

		int frozenColIndex = -1;
		int frozenRowIndex = -1;
		 
        PaneInformation paneInformation = sheet.getPaneInformation();
        if (paneInformation != null && paneInformation.isFreezePane()) {
            //冻结到第几列
        	frozenColIndex = paneInformation.getVerticalSplitPosition() - 1;
            //冻结到第几行
        	frozenRowIndex = paneInformation.getHorizontalSplitPosition() - 1;
        } 
		
		List<ExcelGridRow> egRows = new ArrayList<ExcelGridRow>();
		egs.setAllRows(egRows);
		for(int i = 0; i <= lastRowIndex; i++){
			
			//注意，当i<=lastRowIndex时，sheet.getRow(i)取得的值也可能是null
			Row sheetRow = sheet.getRow(i);
			
			ExcelGridRow egRow = new ExcelGridRow();
			egRows.add(egRow);
			
			String rowId = UUID.randomUUID().toString();
			egRow.setId(rowId);
			
			egRow.setSheetId(sheetId);
			
			int rowHeight = sheetRow == null ? 19 : (int)(sheetRow.getHeightInPoints() * 4 / 3);
			egRow.setHeight(rowHeight); 
			egRow.setIsFrozen(i <= frozenRowIndex);			
		}

		List<ExcelGridColumn> egCols = new ArrayList<ExcelGridColumn>();
		egs.setAllColumns(egCols);
		for(int i = 0; i <= lastColIndex; i++){ 
			ExcelGridColumn egCol = new ExcelGridColumn();
			egCols.add(egCol);
			
			String colId = UUID.randomUUID().toString();
			egCol.setId(colId);
			
			egCol.setSheetId(sheetId);
			 
			int colWidth = 8 + (int)(sheet.getColumnWidth(i) / 32);
			egCol.setWidth(colWidth); 
			egCol.setIsFrozen(i <= frozenColIndex);			
		}


		HashMap<String, ExcelGridCell> egCells = eg.getAllCells();
		
	    //合并的单元格数量
        int merged = sheet.getNumMergedRegions();
        //预读合并的单元格
        for (int i = 0; i < merged; i++) {
            CellRangeAddress range = sheet.getMergedRegion(i);
            int y0 = range.getFirstRow();
            int x0 = range.getFirstColumn();
            int y1 = range.getLastRow();
            int x1 = range.getLastColumn();
            if(x0 <= frozenColIndex && frozenColIndex < x1 && y0 <= frozenRowIndex && frozenRowIndex < y1){
            	//分割成4块
            	this.getMergeRangeCells(sheetId, egRows, egCols, egCells, x0, y0, frozenColIndex, frozenRowIndex);
            	this.getMergeRangeCells(sheetId, egRows, egCols, egCells, frozenColIndex + 1, y0, x1, frozenRowIndex);
            	this.getMergeRangeCells(sheetId, egRows, egCols, egCells, x0, frozenRowIndex + 1, frozenColIndex, y1);
            	this.getMergeRangeCells(sheetId, egRows, egCols, egCells, frozenColIndex + 1, frozenRowIndex + 1, x1, y1);
            }
            else if(x0 <= frozenColIndex && frozenColIndex < x1){
            	//分割成2块
            	this.getMergeRangeCells(sheetId, egRows, egCols, egCells, x0, y0, frozenColIndex, y1); 
            	this.getMergeRangeCells(sheetId, egRows, egCols, egCells, frozenColIndex + 1, y0, x1, y1); 
            }
            else if(y0 <= frozenRowIndex && frozenRowIndex < y1){
            	//分割成2块
            	this.getMergeRangeCells(sheetId, egRows, egCols, egCells, x0, y0, x1, frozenRowIndex); 
            	this.getMergeRangeCells(sheetId, egRows, egCols, egCells, x0, frozenRowIndex + 1, x1, y1); 
            }
            else{
            	this.getMergeRangeCells(sheetId, egRows, egCols, egCells, x0, y0, x1, y1); 
            }  
        }

		for(int i = 0; i <= lastRowIndex; i++){
			Row sheetRow = sheet.getRow(i);
			ExcelGridRow egRow = egRows.get(i);
			String rowId = egRow.getId();
			if(i % 100 == 0){ 
				int iii=i;
				iii=i;
			}  
			System.out.println( "执行到行：" + i);   
			for(int j = 0; j <= lastColIndex; j++){
				
	            
				try{
					ExcelGridColumn egCol = egCols.get(j);
					String colId = egCol.getId();
					String cellId = sheetId + "_" + colId + "_" + rowId;
					if(!egCells.containsKey(cellId)){
						ExcelGridCell unMergeEgCell = new ExcelGridCell();
						unMergeEgCell.setId(cellId);
						unMergeEgCell.setSheetId(sheetId);
						unMergeEgCell.setRowId(rowId);
						unMergeEgCell.setColumnId(colId); 
						egCells.put(cellId, unMergeEgCell);
					}
					ExcelGridCell egCell = egCells.get(cellId); 
					if(sheetRow != null){
						Cell sheetCell = sheetRow.getCell(j);
						if(sheetCell != null){
							if(!egCell.isHidden()){
								this.getCellDataFromSheetToExcelGrid(sheetCell, egCell); 
							}
						}
						this.getCellCssStyleFromSheetToExcelGrid(wb, sheet, sheetCell, egCell); 
					}
				}
				catch(Exception ex){
					ex.printStackTrace();
					throw ex;
				}
			}				
		}
		
		//处理左右、上下相邻边框的样式信息，excel的处理和此系统的处理不太一样，excel的处理是左侧单元格设置了右边框时，右侧单元格的左边框会变为null，此系统的处理方式是，同时改变两个边框的样式为相同样式
		this.processAdjacentCellBorderStyle(eg, egs);
		
		return egs;
	}
	
	private void processAdjacentCellBorderStyle(ExcelGrid eg, ExcelGridSheet egs){
		HashMap<String, ExcelGridCell> allCells = eg.getAllCells();
		String sheetId = egs.getId();
		List<ExcelGridColumn> allColumns = egs.getAllColumns();
		List<ExcelGridRow> allRows = egs.getAllRows();
		for(int i = 0; i < allColumns.size(); i++){
			ExcelGridColumn column = allColumns.get(i);
			String colId = column.getId();
			String leftColId = null;
			if(i > 0){
				leftColId = allColumns.get(i - 1).getId();
			}
			for(int j = 0; j < allRows.size(); j++){
				ExcelGridRow row = allRows.get(j);
				String rowId = row.getId();
				String cellId = sheetId + "_" + colId + "_" + rowId;
				ExcelGridCell cell = allCells.get(cellId);
				ExcelGridCssStyle cssStyle = cell.getCssStyle(); 
				
				//上面的单元格 
				if(j > 0){
					String upRowId = allRows.get(j - 1).getId();
					String upCellId = sheetId + "_" + colId + "_" + upRowId;
					ExcelGridCell upCell = allCells.get(upCellId);
					ExcelGridCssStyle upCssStyle = upCell.getCssStyle(); 
					if(upCssStyle != null){
						if(upCssStyle.getBorderBottom() != null){
							cssStyle.setBorderTop(upCssStyle.getBorderBottom().clone());
						}
						else if(cssStyle.getBorderTop() != null){
							upCssStyle.setBorderBottom(cssStyle.getBorderTop().clone());
						} 
					}
				}
				
				//左面的单元格 
				if(leftColId != null){ 
					String leftCellId = sheetId + "_" + leftColId + "_" + rowId;
					ExcelGridCell leftCell = allCells.get(leftCellId);
					ExcelGridCssStyle leftCssStyle = leftCell.getCssStyle(); 
					if(leftCssStyle != null){
						if(leftCssStyle.getBorderRight() != null){
							cssStyle.setBorderLeft(leftCssStyle.getBorderRight().clone());
						}
						else if(cssStyle.getBorderLeft() != null){
							leftCssStyle.setBorderRight(cssStyle.getBorderLeft().clone());
						} 
					}
				}
			} 
		}
	}
	
	private void getMergeRangeCells(String sheetId, List<ExcelGridRow> egRows, List<ExcelGridColumn> egCols, HashMap<String, ExcelGridCell> egCells, int x0, int y0, int x1, int y1){
		String groupCellId = "";
		for(int x = x0; x <= x1; x++){
			ExcelGridColumn egCol = egCols.get(x);
			String colId = egCol.getId();
			for(int y = y0; y <= y1; y++){
				ExcelGridRow egRow = egRows.get(y);
				String rowId = egRow.getId();
				String cellId = sheetId + "_" + colId + "_" + rowId;
				ExcelGridCell egCell = new ExcelGridCell();
				egCell.setSheetId(sheetId);
				egCell.setId(cellId);
				egCell.setRowId(rowId);
				egCell.setColumnId(colId); 
				if(x == x0 && y == y0){
					egCell.setColSpan(x1 - x0 + 1);
					egCell.setRowSpan(y1 - y0 + 1);
					groupCellId = cellId;
					egCell.setGroupCellId(groupCellId);
				}
				else{
					egCell.setGroupCellId(groupCellId);
				}
				egCells.put(cellId, egCell);
			}
		}
	} 
    private void getCellCssStyleFromSheetToExcelGrid(XSSFWorkbook wb, XSSFSheet sheet, Cell cell, ExcelGridCell egCell) throws Exception { 
		ExcelGridCssStyle egCellStyle = egCell.getCssStyle(); 
    	if(cell != null){
	    	XSSFCellStyle cellStyle = (XSSFCellStyle)cell.getCellStyle();
	    	if(cellStyle != null){ 
	    		if(cellStyle.getFillForegroundXSSFColor() != null){
		    		String backgroundColor = this.getColorRgb(cellStyle.getFillForegroundXSSFColor());
		    		egCellStyle.setBackgroundColor(backgroundColor);
	    		}
	    		
	    		XSSFFont font = cellStyle.getFont(); 
	    		if(font != null){ 
		    		String fontStyle = ExcelGridFontStyleType.normal;
	
		    		if(font.getXSSFColor() != null){
			    		String color = this.getColorRgb(font.getXSSFColor());
			    		egCellStyle.setColor(color);
		    		}
		    		if(font.getBold()){
		    			if(font.getItalic()){
		    				fontStyle = ExcelGridFontStyleType.italicBold;
		    			}
		    			else{
		    				fontStyle = ExcelGridFontStyleType.bold;
		    			}
		    		}
		    		else{
		    			if(font.getItalic()){
		    				fontStyle = ExcelGridFontStyleType.italic;
		    			}
		    		}
		    		egCellStyle.setFontStyle(fontStyle);
		    		
		    		int fontSize = font.getFontHeightInPoints();
		    		egCellStyle.setFontSize(fontSize);
				  
		    		String fontName = font.getFontName();
		    		String fontFamily = ExcelGridFontNames.getFontId(fontName);
		    		egCellStyle.setFontFamily(fontFamily);

		    		String textHAlign = ExcelGridTextAlignType.general;
		    		String textVAlign = ExcelGridTextAlignType.middle;
		    		HorizontalAlignment hAlign = cellStyle.getAlignmentEnum(); 
		    		VerticalAlignment vAlign = cellStyle.getVerticalAlignmentEnum();
		    		switch(hAlign){
						case RIGHT: 
							textHAlign = ExcelGridTextAlignType.right;
							break;
						case CENTER: 
							textHAlign = ExcelGridTextAlignType.center;
							break;
						case LEFT:  
							textHAlign = ExcelGridTextAlignType.left;
							break;
						case GENERAL:
						default: 
							textHAlign = ExcelGridTextAlignType.general;
							break;
		    		} 
					switch(vAlign){
						case BOTTOM:{
							textVAlign = ExcelGridTextAlignType.bottom;
						}
						break;
						case TOP:{
							textVAlign = ExcelGridTextAlignType.top;
						}
						break;
						case CENTER:
						default:{
							textVAlign = ExcelGridTextAlignType.middle;
						}
						break;
					}
		    		egCellStyle.setTextHAlign(textHAlign);
		    		egCellStyle.setTextVAlign(textVAlign);
	    		}
	    		
	    		XSSFColor borderLeftColor = cellStyle.getLeftBorderXSSFColor();
	    		BorderStyle borderLeftStyle = cellStyle.getBorderLeftEnum(); 
	    		egCellStyle.setBorderLeft(this.getBorderStyleFromExcel(borderLeftColor, borderLeftStyle));
	    		
	    		XSSFColor borderTopColor = cellStyle.getTopBorderXSSFColor();
	    		BorderStyle borderTopStyle = cellStyle.getBorderTopEnum(); 
	    		egCellStyle.setBorderTop(this.getBorderStyleFromExcel(borderTopColor, borderTopStyle));
	    		
	    		XSSFColor borderRightColor = cellStyle.getRightBorderXSSFColor();
	    		BorderStyle borderRightStyle = cellStyle.getBorderRightEnum(); 
	    		egCellStyle.setBorderRight(this.getBorderStyleFromExcel(borderRightColor, borderRightStyle));
	    		
	    		XSSFColor borderBottomColor = cellStyle.getBottomBorderXSSFColor();
	    		BorderStyle borderBottomStyle = cellStyle.getBorderBottomEnum(); 
	    		egCellStyle.setBorderBottom(this.getBorderStyleFromExcel(borderBottomColor, borderBottomStyle));
	    		   		
	    	}
    	}
	} 
    
    private String getColorRgb(XSSFColor color){
    	String argb = color.getARGBHex();
    	return argb == null || argb.isEmpty() ? "" : argb.substring(2); 
    	
    }
    
    private ExcelGridBorderStyle getBorderStyleFromExcel(XSSFColor color, BorderStyle borderStyleType){
    	if(borderStyleType == BorderStyle.NONE){
    		return null;
    	}
    	else{
	    	ExcelGridBorderStyle egBorderStyle = new ExcelGridBorderStyle();
	    	if(color != null){
	    		egBorderStyle.setColor(this.getColorRgb(color));
	    	}
	    	String styleType = ExcelGridBorderStyleType.none;
	    	int width = 1;
	    	switch(borderStyleType){
		    	case DASH_DOT:
		    	case DASH_DOT_DOT:
		    	case DASHED:
		    	case SLANTED_DASH_DOT:
		    		styleType = ExcelGridBorderStyleType.dashed;
		    		width = 1;
		    		break;
		    	case DOTTED:
		    		styleType = ExcelGridBorderStyleType.dotted;
		    		width = 1;
		    		break;
		    	case HAIR:
		    	case THIN:
		    		styleType = ExcelGridBorderStyleType.solid;
		    		width = 1;
		    		break;
		    	case DOUBLE:
		    	case MEDIUM:
		    	case THICK:
		    		styleType = ExcelGridBorderStyleType.solid;
		    		width = 2;
		    		break;
		    	case MEDIUM_DASH_DOT:
		    	case MEDIUM_DASH_DOT_DOTC: 
		    	case MEDIUM_DASHED:
		    		styleType = ExcelGridBorderStyleType.dashed;
		    		width = 2;
		    		break;
		    	case NONE:
		    		styleType = ExcelGridBorderStyleType.none;
		    		width = 1;
		    		break; 
	    	}
	    	egBorderStyle.setStyle(styleType);
	    	egBorderStyle.setWidth(width);
	    	return egBorderStyle;
    	}
    }
    private void getCellDataFromSheetToExcelGrid(Cell cell, ExcelGridCell egCell) throws Exception {
        Object cellValue = null;
        String expression = "";
        boolean isExp = false;
        ValueType cellValueType = ValueType.String;
        if (cell != null) {
            try {
                switch (cell.getCellType()) {
                    case Cell.CELL_TYPE_BLANK://空白
                        cellValue = "";
                        break;
                    case Cell.CELL_TYPE_NUMERIC: //数值型 0----日期类型也是数值型的一种
                        if (DateUtil.isCellDateFormatted(cell)) {  
                        	Date dateValue = cell.getDateCellValue();
                        	cellValue = dateValue; 
                        	cellValueType = ValueType.Time;
                        } else {
                        	cellValue = new BigDecimal(cell.getNumericCellValue());
                        	cellValueType = ValueType.Decimal;
                        }
                        break;
                    case Cell.CELL_TYPE_STRING: //字符串型 1
                        cellValue = cell.getStringCellValue();
                        cellValueType = ValueType.String;
                        break;
                    case Cell.CELL_TYPE_FORMULA: //公式型 2
                    	expression = "=" + cell.getCellFormula();
                    	isExp = true;
                        break;
                    case Cell.CELL_TYPE_BOOLEAN: //布尔型 4
                        cellValue = cell.getBooleanCellValue();
                        break;
                    case Cell.CELL_TYPE_ERROR: //错误 5
                        throw new Exception("读取Excel单元格数据出错：CellType = CELL_TYPE_ERROR"); 
                }
                
                egCell.setValue(cellValue);
                egCell.setExpression(expression);
                egCell.setIsExp(isExp);
                egCell.setCellValueType(cellValueType);
                
            } catch (Exception e) {
                System.out.println("读取Excel单元格数据出错：" + e.getMessage()); 
                throw new Exception("读取Excel单元格数据出错：" + e.getMessage(), e);
            }
        }
    }
	
	public XSSFWorkbook getExcelWorkbookByFilePath(INcpSession session, String excelFilePath) throws Exception{	 
		InputStream fs= null;
		try {
			fs = new FileInputStream(excelFilePath); 
			XSSFWorkbook wb = new XSSFWorkbook(fs); 
			return wb;
		}
		catch(Exception ex){
			ex.printStackTrace();
			throw new Exception("读取Excel文件出错, 请确定上传的Excel文件可以正常打开");
		}
		finally{
			if(fs != null){
				fs.close();
				fs = null;
			}
		}
	}
}