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

import org.apache.poi.hssf.util.HSSFColor;
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
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
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

public class ConvertExcelXlsxToExcelGridProcessor extends ConvertExcelToExcelGridProcessor{	 

	@Override
    protected  String getColorRgb(Color color){
    	String argb = ((XSSFColor)color).getARGBHex();
    	return argb == null || argb.isEmpty() ? "" : argb.substring(2); 
    	
    }  
	
	@Override
    protected void getCellCssStyleFromSheetToExcelGrid(Workbook wb, Sheet sheet, Cell cell, ExcelGridCell egCell) throws Exception { 
		ExcelGridCssStyle egCellStyle = egCell.getCssStyle(); 
    	if(cell != null){
	    	XSSFCellStyle cellStyle = (XSSFCellStyle) cell.getCellStyle();
	    	if(cellStyle != null){ 
	    		//if(cellStyle.getFillForegroundXSSFColor() != null){
	    		if(cellStyle.getFillForegroundColorColor() != null){
		    		String backgroundColor = this.getColorRgb(cellStyle.getFillForegroundColorColor());
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
	
	@Override
	public Workbook getExcelWorkbookByFilePath(INcpSession session, String excelFilePath) throws Exception{	 
		InputStream fs= null;
		try {
			fs = new FileInputStream(excelFilePath); 
			Workbook wb = new XSSFWorkbook(fs); 
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