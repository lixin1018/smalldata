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

import org.apache.poi.hssf.usermodel.HSSFBorderFormatting;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.hssf.util.PaneInformation;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Color;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
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

public class ConvertExcelXlsToExcelGridProcessor extends ConvertExcelToExcelGridProcessor{	 
	@Override
    protected  String getColorRgb(Color color){	
		if(color instanceof HSSFColor.AUTOMATIC){
			return "";
		}
		else{
	    	String argb = ((HSSFColor)color).getHexString();
	    	if(argb == null || argb.isEmpty()){
	    		return "";
	    	}
	    	else{
	    		String[] ps = argb.split(":");
	    		StringBuilder s = new StringBuilder();
	    		for(int i = 0; i < ps.length; i++){
	    			String p = ps[i];
	    			switch(p.length()){
	    			case 0:
	    				s.append("00");
	    				break;
	    			case 1:
	    				s.append("0" + p);
	    				break;
	    			default:
	    				s.append(p.substring(0, 2));
	    				break;
	    			}
	    		}
	    		return s.toString();
	    	}
		}
    }

    protected  HSSFColor getColor(short colorShort){
    	HSSFColor color = HSSFColor.getIndexHash().get(colorShort); 
    	return color;
    }   
	
	@Override
    protected void getCellCssStyleFromSheetToExcelGrid(Workbook wb, Sheet sheet, Cell cell, ExcelGridCell egCell) throws Exception { 
		ExcelGridCssStyle egCellStyle = egCell.getCssStyle(); 
    	if(cell != null){
	    	HSSFCellStyle cellStyle = (HSSFCellStyle)cell.getCellStyle();
	    	if(cellStyle != null){ 
	    		//if(cellStyle.getFillForegroundXSSFColor() != null){
	    		if(cellStyle.getFillForegroundColorColor() != null){
		    		String backgroundColor = this.getColorRgb(cellStyle.getFillForegroundColorColor());
		    		egCellStyle.setBackgroundColor(backgroundColor);
	    		}
	    		
	    		HSSFFont font = ((HSSFCellStyle)cellStyle).getFont(wb); 
	    		if(font != null){ 
		    		String fontStyle = ExcelGridFontStyleType.normal;
	
		    		if(font.getHSSFColor((HSSFWorkbook) wb) != null){
			    		String color = this.getColorRgb(font.getHSSFColor((HSSFWorkbook) wb));
			    		egCellStyle.setColor(color);
		    		}

		    		if(font.getBoldweight() == Font.BOLDWEIGHT_BOLD){
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
		    		short hAlign = cellStyle.getAlignment();
		    		short vAlign = cellStyle.getVerticalAlignment();
		    		switch(hAlign){
						case HSSFCellStyle.ALIGN_RIGHT: 
							textHAlign = ExcelGridTextAlignType.right;
							break;
						case HSSFCellStyle.ALIGN_CENTER: 
							textHAlign = ExcelGridTextAlignType.center;
							break;
						case HSSFCellStyle.ALIGN_LEFT:  
							textHAlign = ExcelGridTextAlignType.left;
							break;
						case HSSFCellStyle.ALIGN_GENERAL:
						default: 
							textHAlign = ExcelGridTextAlignType.general;
							break;
		    		} 
					switch(vAlign){					
						case HSSFCellStyle.VERTICAL_BOTTOM:{
							textVAlign = ExcelGridTextAlignType.bottom;
						}
						break;
						case HSSFCellStyle.VERTICAL_TOP:{
							textVAlign = ExcelGridTextAlignType.top;
						}
						break;
						case HSSFCellStyle.VERTICAL_CENTER: 
						default:{
							textVAlign = ExcelGridTextAlignType.middle;
						}
						break;
					}
		    		egCellStyle.setTextHAlign(textHAlign);
		    		egCellStyle.setTextVAlign(textVAlign);
	    		}
	    		
	    		HSSFColor borderLeftColor = this.getColor(cellStyle.getLeftBorderColor());
	    		BorderStyle borderLeftStyle = BorderStyle.values()[ cellStyle.getBorderLeft()]; 
	    		egCellStyle.setBorderLeft(this.getBorderStyleFromExcel(borderLeftColor, borderLeftStyle));
	    		
	    		HSSFColor borderTopColor = this.getColor(cellStyle.getTopBorderColor());
	    		BorderStyle borderTopStyle = BorderStyle.values()[ cellStyle.getBorderTop()]; 
	    		egCellStyle.setBorderTop(this.getBorderStyleFromExcel(borderTopColor, borderTopStyle));
	    		
	    		HSSFColor borderRightColor = this.getColor(cellStyle.getRightBorderColor());
	    		BorderStyle borderRightStyle = BorderStyle.values()[cellStyle.getBorderRight()]; 
	    		egCellStyle.setBorderRight(this.getBorderStyleFromExcel(borderRightColor, borderRightStyle));
	    		
	    		HSSFColor borderBottomColor = this.getColor(cellStyle.getBottomBorderColor());
	    		BorderStyle borderBottomStyle = BorderStyle.values()[cellStyle.getBorderBottom()]; 
	    		egCellStyle.setBorderBottom(this.getBorderStyleFromExcel(borderBottomColor, borderBottomStyle));
	    		   		
	    	}
    	}
	} 
	
	@Override
	public Workbook getExcelWorkbookByFilePath(INcpSession session, String excelFilePath) throws Exception{	 
		InputStream fs= null;
		try {
			fs = new FileInputStream(excelFilePath); 
			Workbook wb = new HSSFWorkbook(fs); 
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