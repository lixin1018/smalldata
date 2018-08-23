package com.novacloud.novaone.importExport.definition;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List; 
import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import com.novacloud.novaone.common.ValueConverter; 

//输入输出定义类
public class ImportExportDefinition {
	//构造函数
	public ImportExportDefinition(){
		
	}
	//构造函数
	public ImportExportDefinition(String xml) throws Exception{
		Document document = null;
		try{
			SAXReader reader = new SAXReader(); 
			document = reader.read(new StringReader(xml));
			//根节点
			Element rootNode = document.getRootElement();
			
			//UpdateType
			String updateTypeStr = rootNode.attribute("UpdateType").getValue();
			UpdateType updateType = Enum.valueOf(UpdateType.class, updateTypeStr);
			this.setUpdateType(updateType);

			//FileType
			String fileTypeStr = rootNode.attribute("FileType").getValue();
			FileType fileType = Enum.valueOf(FileType.class, fileTypeStr);
			this.setFileType(fileType);

			//Orderby
			String orderby = rootNode.attribute("Orderby") == null ? "" : rootNode.attribute("Orderby").getValue(); 
			this.setOrderby(orderby);
			
			//FileParser
			switch(fileType){
			case EXCEL:{
				ExcelParser ep = new ExcelParser();					
				this.setFileParser(ep);

				Element excelParserNode = rootNode.element("ExcelParser");
				boolean hasHeaderRow = true;
				Attribute hasHeaderRowAttri = excelParserNode.attribute("HasHeaderRow");
				if(hasHeaderRowAttri != null){
					String hasHeaderRowStr = excelParserNode.attribute("HasHeaderRow").getValue();
					hasHeaderRow = Boolean.parseBoolean(hasHeaderRowStr);
				}
				ep.setHasHeaderRow(hasHeaderRow);

				List<ExcelColumn> columns =new ArrayList<ExcelColumn>();
				ep.setColumns(columns);
				Element columnsNode = excelParserNode.element("Columns");
				List<Element> columnNodeList = columnsNode.elements("Column");
				for(int i=0;i<columnNodeList.size();i++){
					Element columnNode = columnNodeList.get(i);
					ExcelColumn column = new ExcelColumn();

				    Attribute excelColumnAttri = columnNode.attribute("ExcelColumnName");
				    String excelColumnName = excelColumnAttri.getValue();
				    column.setExcelColumnName(excelColumnName); 
				    
				    Attribute itemNameAttri = columnNode.attribute("ItemName");
				    String itemName = itemNameAttri.getValue();
				    column.setItemName(itemName);
				    
				    Attribute dataTypeAttri = columnNode.attribute("DataType");
				    String dataTypeStr = dataTypeAttri.getValue();
				    DataType dataType = Enum.valueOf(DataType.class, dataTypeStr);
				    column.setDataType(dataType);
				    
				    Attribute formatPatternAttri = columnNode.attribute("FormatPattern");
				    if(formatPatternAttri != null){
					    String formatPattern= formatPatternAttri.getValue(); 
					    column.setFormatPattern(formatPattern);
				    }
				    
				    columns.add(column);
				}
				break;
			}  
			case CSV:{
				CsvParser ep = new CsvParser();					
				this.setFileParser(ep);

				Element csvParserNode = rootNode.element("CsvParser");
				boolean hasHeaderRow = true;
				Attribute hasHeaderRowAttri = csvParserNode.attribute("HasHeaderRow");
				if(hasHeaderRowAttri != null){
					String hasHeaderRowStr = csvParserNode.attribute("HasHeaderRow").getValue();
					hasHeaderRow = Boolean.parseBoolean(hasHeaderRowStr);
				}
				ep.setHasHeaderRow(hasHeaderRow);

				List<CsvColumn> columns =new ArrayList<CsvColumn>();
				ep.setColumns(columns);
				Element columnsNode = csvParserNode.element("Columns");
				List<Element> columnNodeList = columnsNode.elements("Column");
				for(int i=0;i<columnNodeList.size();i++){
					Element columnNode = columnNodeList.get(i);
					CsvColumn column = new CsvColumn();

				    Attribute csvColumnAttri = columnNode.attribute("CsvColumnName");
				    String csvColumnName = csvColumnAttri.getValue();
				    column.setCsvColumnName(csvColumnName); 
				    
				    Attribute itemNameAttri = columnNode.attribute("ItemName");
				    String itemName = itemNameAttri.getValue();
				    column.setItemName(itemName);
				    
				    Attribute dataTypeAttri = columnNode.attribute("DataType");
				    String dataTypeStr = dataTypeAttri.getValue();
				    DataType dataType = Enum.valueOf(DataType.class, dataTypeStr);
				    column.setDataType(dataType);
				    
				    Attribute formatPatternAttri = columnNode.attribute("FormatPattern");
				    if(formatPatternAttri != null){
					    String formatPattern= formatPatternAttri.getValue(); 
					    column.setFormatPattern(formatPattern);
				    }
				    
				    columns.add(column);
			}
				break;
				} 
				case XML:{
					break;
				}
				default:{
					break;
				}
			}
			
			//FieldList
			Element fieldListNode = rootNode.element("FieldList");
			List<Field> fieldList = new ArrayList<Field>();					
			this.setFieldList(fieldList); 
			List<Element> fieldNodeList = fieldListNode.elements("Field");
			for(int i=0;i<fieldNodeList.size();i++){
				Element fieldNode = fieldNodeList.get(i);
				Field field = new Field();

			    Attribute itemNameAttri = fieldNode.attribute("ItemName");
			    String itemName = itemNameAttri.getValue();
			    field.setItemName(itemName);

			    Attribute dbFieldNameAttri = fieldNode.attribute("DBFieldName");
			    String dbFieldName = dbFieldNameAttri.getValue();
			    field.setDbFieldName(dbFieldName);

			    Attribute showNameAttri = fieldNode.attribute("ShowName");
			    String showName =showNameAttri == null ? itemNameAttri.getValue() : showNameAttri.getValue();
			    field.setShowName(showName);

			    Attribute isUniqueAttri = fieldNode.attribute("IsUnique");
			    String isUniqueStr = isUniqueAttri.getValue();
			    boolean isUnique = Boolean.parseBoolean(isUniqueStr);
			    field.setIsUnique(isUnique);

			    Attribute widthAttri = fieldNode.attribute("Width");
			    String widthStr = widthAttri.getValue();
			    int width = Integer.parseInt(widthStr);
			    field.setWidth(width);

			    Attribute displayWidthAttri = fieldNode.attribute("DisplayWidth");
			    if(displayWidthAttri != null){
				    String displayWidthStr =  displayWidthAttri.getValue();
				    int displayWidth = Integer.parseInt(displayWidthStr);
				    field.setDisplayWidth(displayWidth);
			    }

			    Attribute fractionLengthAttri = fieldNode.attribute("FractionLength");
			    if(fractionLengthAttri != null){
				    String fractionLengthStr =  fractionLengthAttri.getValue();
				    int fractionLength = Integer.parseInt(fractionLengthStr);
				    field.setFractionLength(fractionLength);
			    }

			    Attribute fieldTypeAttri = fieldNode.attribute("FieldType");
			    String fieldTypeStr = fieldTypeAttri.getValue();
			    DataType fieldType = Enum.valueOf(DataType.class, fieldTypeStr);
			    field.setFieldType(fieldType);

			    Attribute canQueryAttri = fieldNode.attribute("CanQuery");
			    if(canQueryAttri != null){
				    String canQueryStr = canQueryAttri.getValue();
				    boolean canQuery = Boolean.parseBoolean(canQueryStr);
				    field.setCanQuery(canQuery);
			    }

			    Attribute formatPatternAttri = fieldNode.attribute("FormatPattern");
			    if(formatPatternAttri != null){
				    String formatPattern = formatPatternAttri.getValue();
				    field.setFormatPattern(formatPattern);
			    }
			    
			    Element listOptionsNode = fieldNode.element("ListOptions");
			    if(listOptionsNode != null){
			    	ListOptions listOptions = new ListOptions(); 
			    	field.setListOptions(listOptions);

				    Attribute listTypeAttri = listOptionsNode.attribute("ListType");
				    String listTypeStr = listTypeAttri.getValue();
				    ListType listType = Enum.valueOf(ListType.class, listTypeStr);
				    listOptions.setListType(listType);

				    Attribute isMultiValueAttri = listOptionsNode.attribute("IsMultiValue");
				    if(isMultiValueAttri != null){
					    String isMultiValueStr = isMultiValueAttri.getValue();
					    boolean isMultiValue = Boolean.parseBoolean(isMultiValueStr);
					    listOptions.setIsMultiValue(isMultiValue);
				    }

				    Attribute listSplitterAttri = listOptionsNode.attribute("ListSplitter");
				    if(listSplitterAttri != null){
					    String listSplitter = listSplitterAttri.getValue(); 
					    listOptions.setListSplitter(listSplitter);
				    }
				    
				    switch(listType){
				    	case Static:{
				    		List<Element> optionNodeList = listOptionsNode.elements("Option");
				    		List<Option> options = new ArrayList<Option>();
				    		listOptions.setOptions(options);
				    		
				    		for(int j=0;j<optionNodeList.size();j++){
				    			Element optionNode = optionNodeList.get(j);
				    			Option option = new Option();

							    Attribute keyAttri = optionNode.attribute("Key");
							    String key = keyAttri.getValue();
							    option.setKey(key);

							    Attribute valueAttri = optionNode.attribute("Value");
							    String value = valueAttri.getValue();
							    option.setValue(value);		

							    options.add(option);
				    		}
				    		break;
				    	}
				    }
			    } 
			    fieldList.add(field);
			} 
		}
		catch(Exception ex){
			throw ex;
		}
	}
	//构造函数
	public String toXml() throws DocumentException{
		String xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?><ImportExportDefinition></ImportExportDefinition>";
		Document document = null; 
		SAXReader reader = new SAXReader(); 
		document = reader.read(new StringReader(xml)); 
		//根节点
		Element rootNode = document.getRootElement();
		
		//UpdateType
		rootNode.addAttribute("UpdateType", this.getUpdateType().toString()); 

		//FileType
		rootNode.addAttribute("FileType", this.getFileType().toString()); 

		//Orderby
		rootNode.addAttribute("Orderby", this.getOrderby()); 
		
		//FileParser
		switch(this.getFileType()){
			case EXCEL:{
				ExcelParser ep = (ExcelParser)this.getFileParser();	 

				Element excelParserNode = rootNode.addElement("ExcelParser"); 
				boolean hasHeaderRow = true;

				excelParserNode.addAttribute("HasHeaderRow", ((Boolean)ep.getHasHeaderRow()).toString());
 
					Element columnsNode = excelParserNode.addElement("Columns"); 
				List<ExcelColumn> columns = ep.getColumns();
				for(int i = 0; i < ep.getColumns().size(); i++){
					Element columnNode = columnsNode.addElement("Column");
					ExcelColumn column = columns.get(i);

					columnNode.addAttribute("ExcelColumnName", column.getExcelColumnName()); 
					columnNode.addAttribute("ItemName", column.getItemName()); 
				    columnNode.addAttribute("DataType", column.getDataType().toString()); 
				    columnNode.addAttribute("FormatPattern", column.getFormatPattern()); 
				}
				break;
			}
			case CSV:{
				CsvParser ep = (CsvParser)this.getFileParser();	 

				Element csvParserNode = rootNode.addElement("CsvParser"); 
				boolean hasHeaderRow = true;

				csvParserNode.addAttribute("HasHeaderRow", ((Boolean)ep.getHasHeaderRow()).toString());
 
				Element columnsNode = csvParserNode.addElement("Columns"); 
				List<CsvColumn> columns = ep.getColumns();
				for(int i = 0; i < ep.getColumns().size(); i++){
					Element columnNode = columnsNode.addElement("Column");
					CsvColumn column = columns.get(i);

					columnNode.addAttribute("CsvColumnName", column.getCsvColumnName()); 
					columnNode.addAttribute("ItemName", column.getItemName()); 
				    columnNode.addAttribute("DataType", column.getDataType().toString()); 
				    columnNode.addAttribute("FormatPattern", column.getFormatPattern()); 
				}
				break;
			}
			case XML:{
				break;
			}
			default:{
				break;
			}
		}
		
		//FieldList
		Element fieldListNode = rootNode.addElement("FieldList"); 		 
		List<Field> fields = this.getFieldList();
		for(int i = 0; i < fields.size(); i++){
			Element fieldNode = fieldListNode.addElement("Field");
			Field field = fields.get(i);

		    fieldNode.addAttribute("ItemName", field.getItemName());

		    fieldNode.addAttribute("DBFieldName", field.getDbFieldName());

		    fieldNode.addAttribute("ShowName", field.getShowName());

		    fieldNode.addAttribute("IsUnique", ((Boolean)field.getIsUnique()).toString());

		    fieldNode.addAttribute("Width", ((Integer)field.getWidth()).toString());

		    fieldNode.addAttribute("DisplayWidth", ((Integer)field.getDisplayWidth()).toString()); 

		    fieldNode.addAttribute("FieldType", field.getFieldType().toString()); 

		    fieldNode.addAttribute("CanQuery", ((Boolean)field.getCanQuery()).toString());

		    fieldNode.addAttribute("FormatPattern", field.getFormatPattern()); 
		    
		    ListOptions listOptions = field.getListOptions();
		    if(listOptions != null){
			    Element listOptionsNode = fieldNode.addElement("ListOptions"); 

				listOptionsNode.addAttribute("ListType", listOptions.getListType().toString()); 
				
				listOptionsNode.addAttribute("CanQuery", ((Boolean)listOptions.getIsMultiValue()).toString()); 

				listOptionsNode.addAttribute("ListSplitter", listOptions.getListSplitter());  
			    
			    switch(listOptions.getListType()){
			    	case Static:{ 
			    		List<Option> options =listOptions.getOptions();
			    		listOptions.setOptions(options);
			    		
			    		for(int j = 0; j < options.size(); j++){
			    			Element optionNode = listOptionsNode.addElement("Option");
			    			Option option = options.get(j);

						    optionNode.addAttribute("Key", option.getKey());
						    
						    optionNode.addAttribute("Value", option.getValue()); 
			    		}
			    		break;
			    	}
			    }
		    } 
		}  
		return document.asXML();
	}
	
	public static ValidateResult validate(String xml){

		List<String> errors = new ArrayList<String>();
		Document document = null;
		try{
			SAXReader reader = new SAXReader(); 
			document = reader.read(new StringReader(xml));
			//根节点
			Element rootNode = document.getRootElement();
			
			//UpdateType
			if(rootNode.attribute("UpdateType") == null){
				errors.add("没有包含UpdateType属性");
			}
			else{
				String updateTypeStr = rootNode.attributeValue("UpdateType");
				try{
					UpdateType.valueOf(updateTypeStr);
				}
				catch(Exception ex){
					errors.add(updateTypeStr + "不是有效的UpdateType类型值");
				} 
			}

			//FileType 
			FileType fileType = null;
			if(rootNode.attribute("FileType") == null){
				errors.add("没有包含UpdateType属性");
			}
			else{
				String fileTypeStr = rootNode.attributeValue("FileType");
				try{
					fileType = FileType.valueOf(fileTypeStr);
				}
				catch(Exception ex){
					errors.add("值" + fileTypeStr + "不是FileType类型");
				} 
			}

			//FileParser
			if(fileType != null){
				switch(fileType){
					case EXCEL:{ 
						Element excelParserNode = rootNode.element("ExcelParser");
						if(excelParserNode == null){
							errors.add("没有指定ExcelParser节点");
						}
						else{
							boolean hasHeaderRow = true; 
							Attribute hasHeaderRowAttri = excelParserNode.attribute("HasHeaderRow");
							if(hasHeaderRowAttri != null){
								String hasHeaderRowStr = excelParserNode.attribute("HasHeaderRow").getValue();
								try{
									Boolean.parseBoolean(hasHeaderRowStr);
								}
								catch(Exception ex){
									errors.add("HasHeaderRow的值不正确，应该是true/false");
								}
							}
		  
							Element columnsNode = excelParserNode.element("Columns");
							if(columnsNode == null){
								errors.add("未找到Columns节点");
							}
							else{
								List<Element> columnNodeList = columnsNode.elements("Column");
								if(columnNodeList.size() == 0){
									errors.add("Columns未包含任何Column子节点");
								}
								else{
									for(int i=0;i<columnNodeList.size();i++){
										Element columnNode = columnNodeList.get(i);
										ExcelColumn column = new ExcelColumn();

									    Attribute excelColumnAttri = columnNode.attribute("ExcelColumnName");
									    if(excelColumnAttri == null){
									    	errors.add("第" + (i + 1) + "个Column节点没有指定ExcelColumnName");
									    }
									    else{
									    	String excelColumnName = excelColumnAttri.getValue();
										    if(excelColumnName.length() == 0){
										    	errors.add("第" + (i + 1) + "个Column节点没有指定ExcelColumnName");
										    }
									    }
									    
									    Attribute itemNameAttri = columnNode.attribute("ItemName");
									    if(itemNameAttri == null){
									    	errors.add("第" + (i + 1) + "个Column节点没有指定ItemName");
									    }
									    else{
									    	String itemName = itemNameAttri.getValue();
										    if(itemName.length() == 0){
										    	errors.add("第" + (i + 1) + "个Column节点没有指定ItemName");
										    }
									    } 
									    
									    Attribute dataTypeAttri = columnNode.attribute("DataType");
									    if(dataTypeAttri == null){
									    	errors.add("第" + (i + 1) + "个Column节点没有指定DataType");
									    }
									    else{
									    	String dataTypeStr = dataTypeAttri.getValue();
									    	try{
									    		DataType.valueOf(dataTypeStr);
									    	}
									    	catch(Exception ex){
										    	errors.add("第" + (i + 1) + "个Column节点, " + dataTypeStr + "不是有效的DataType类型值");
										    }
									    } 
									}
								}
							}
						}
						break;
					}
					case CSV:{
						Element csvParserNode = rootNode.element("CsvParser");
						if(csvParserNode == null){
							errors.add("没有指定CsvParser节点");
						}
						else{
							boolean hasHeaderRow = true; 
							Attribute hasHeaderRowAttri = csvParserNode.attribute("HasHeaderRow");
							if(hasHeaderRowAttri != null){
								String hasHeaderRowStr = csvParserNode.attribute("HasHeaderRow").getValue();
								try{
									Boolean.parseBoolean(hasHeaderRowStr);
								}
								catch(Exception ex){
									errors.add("HasHeaderRow的值不正确，应该是true/false");
								}
							}
		  
							Element columnsNode = csvParserNode.element("Columns");
							if(columnsNode == null){
								errors.add("未找到Columns节点");
							}
							else{
								List<Element> columnNodeList = columnsNode.elements("Column");
								if(columnNodeList.size() == 0){
									errors.add("Columns未包含任何Column子节点");
								}
								else{
									for(int i=0;i<columnNodeList.size();i++){
										Element columnNode = columnNodeList.get(i);
										ExcelColumn column = new ExcelColumn();

									    Attribute csvColumnAttri = columnNode.attribute("CsvColumnName");
									    if(csvColumnAttri == null){
									    	errors.add("第" + (i + 1) + "个Column节点没有指定CsvColumnName");
									    }
									    else{
									    	String csvColumnName = csvColumnAttri.getValue();
										    if(csvColumnName.length() == 0){
										    	errors.add("第" + (i + 1) + "个Column节点没有指定CsvColumnName");
										    }
									    }
									    
									    Attribute itemNameAttri = columnNode.attribute("ItemName");
									    if(itemNameAttri == null){
									    	errors.add("第" + (i + 1) + "个Column节点没有指定ItemName");
									    }
									    else{
									    	String itemName = itemNameAttri.getValue();
										    if(itemName.length() == 0){
										    	errors.add("第" + (i + 1) + "个Column节点没有指定ItemName");
										    }
									    } 
									    
									    Attribute dataTypeAttri = columnNode.attribute("DataType");
									    if(dataTypeAttri == null){
									    	errors.add("第" + (i + 1) + "个Column节点没有指定DataType");
									    }
									    else{
									    	String dataTypeStr = dataTypeAttri.getValue();
									    	try{
									    		DataType.valueOf(dataTypeStr);
									    	}
									    	catch(Exception ex){
										    	errors.add("第" + (i + 1) + "个Column节点, " + dataTypeStr + "不是有效的DataType类型值");
										    }
									    } 
									}
								}
							}
						}
						break;
					}
					case XML:{
						break;
					}
					default:{
						break;
					}
				}
			}
			
			//FieldList
			Element fieldListNode = rootNode.element("FieldList");
			if(fieldListNode == null){
				errors.add("未包含FieldList节点");
			}
			else{ 
				List<Element> fieldNodeList = fieldListNode.elements("Field");
				if(fieldNodeList.size() == 0){
					errors.add("FieldList未包含任何Field子节点");
				}
				for(int i=0;i<fieldNodeList.size();i++){
					Element fieldNode = fieldNodeList.get(i);
					Field field = new Field();
	
				    Attribute itemNameAttri = fieldNode.attribute("ItemName");
				    if(itemNameAttri == null){
				    	errors.add("第" + (i + 1) + "个Field节点没有指定ItemName");
				    }
				    else{
				    	String itemName = itemNameAttri.getValue();
					    if(itemName.length() == 0){
					    	errors.add("第" + (i + 1) + "个Field节点没有指定ItemName");
					    }
				    } 
	
				    Attribute dbFieldNameAttri = fieldNode.attribute("DBFieldName");
				    if(dbFieldNameAttri == null){
				    	errors.add("第" + (i + 1) + "个Field节点没有指定DBFieldName");
				    }
				    else{
				    	String dbFieldName = dbFieldNameAttri.getValue();
					    if(dbFieldName.length() == 0){
					    	errors.add("第" + (i + 1) + "个Field节点没有指定DBFieldName");
					    }
				    }  
	
				    Attribute isUniqueAttri = fieldNode.attribute("IsUnique");
					if(isUniqueAttri != null){
					    String isUniqueStr = isUniqueAttri.getValue();
						try{
							Boolean.parseBoolean(isUniqueStr);
						}
						catch(Exception ex){
							errors.add("IsUnique的值不正确，应该是true/false");
						}
					} 
	
				    Attribute widthAttri = fieldNode.attribute("Width");
					if(widthAttri != null){
					    String widthStr = widthAttri.getValue();
						try{
							Integer.parseInt(widthStr);
						}
						catch(Exception ex){
							errors.add("Width的值不正确，应该是数值");
						}
					}
	
				    Attribute displayWidthAttri = fieldNode.attribute("DisplayWidth");
					if(displayWidthAttri != null){
					    String displayWidthStr = displayWidthAttri.getValue();
						try{
							Integer.parseInt(displayWidthStr);
						}
						catch(Exception ex){
							errors.add("DisplayWidth的值不正确，应该是数值");
						}
					} 
	
				    Attribute fieldTypeAttri = fieldNode.attribute("FieldType");
				    if(fieldTypeAttri == null){
				    	errors.add("第" + (i + 1) + "个Field节点没有指定FieldType");
				    }
				    else{
				    	String fieldTypeStr = fieldTypeAttri.getValue();
				    	try{
				    		DataType.valueOf(fieldTypeStr);
				    	}
				    	catch(Exception ex){
					    	errors.add("第" + (i + 1) + "个Column节点, " + fieldTypeStr + "不是有效的DataType类型值");
					    }
				    }  
	
				    Attribute canQueryAttri = fieldNode.attribute("CanQuery");
					if(canQueryAttri != null){
					    String canQueryStr = canQueryAttri.getValue();
						try{
							Boolean.parseBoolean(canQueryStr);
						}
						catch(Exception ex){
							errors.add("CanQuery的值不正确，应该是true/false");
						}
					}   
					
				    Element listOptionsNode = fieldNode.element("ListOptions");
				    if(listOptionsNode != null){
				    	ListOptions listOptions = new ListOptions(); 
				    	field.setListOptions(listOptions);
	
				    	ListType listType = null;
					    Attribute listTypeAttri = listOptionsNode.attribute("ListType");
					    if(listTypeAttri == null){
					    	errors.add("第" + (i + 1) + "个Field节点ListOptions没有指定ListType");
					    }
					    else{
					    	String listTypeStr = listTypeAttri.getValue();
					    	try{
					    		listType = ListType.valueOf(listTypeStr);
					    	}
					    	catch(Exception ex){
						    	errors.add("第" + (i + 1) + "个Field节点ListOptions没有指定ListType的值为" + listTypeStr + "不是有效的ListType类型值");
						    }
					    }   
	
					    Attribute isMultiValueAttri = listOptionsNode.attribute("IsMultiValue");
					    if(isMultiValueAttri != null){
						    String isMultiValueStr = isMultiValueAttri.getValue();
							try{
								Boolean.parseBoolean(isMultiValueStr);
							}
							catch(Exception ex){
								errors.add("IsMultiValue的值不正确，应该是true/false");
							} 
					    } 
				    } 
				} 
			}
		}
		catch(Exception ex){
			errors.add(ex.getMessage());
		}
		ValidateResult vr = new ValidateResult();
		if(errors.size() > 0){
			String errorStr = ValueConverter.arrayToString(errors, "\r\n");
			vr.setError(errorStr);
		}
		return vr;
	} 
	
	//排序方式
	private String orderby = null;
	public String getOrderby(){
		return this.orderby;
	}
	public void setOrderby(String orderby){
		this.orderby = orderby;
	}
	
	//数据更新方式
	private UpdateType updateType = null;
	public UpdateType getUpdateType(){
		return this.updateType;
	}
	public void setUpdateType(UpdateType updateType){
		this.updateType = updateType;
	}
	
	//文件类型
	private FileType fileType = null;
	public FileType getFileType(){
		return this.fileType;
	}
	public void setFileType(FileType fileType){
		this.fileType = fileType;
	}
	
	//导入导出文件解析
	private FileParser fileParser = null;
	public FileParser getFileParser(){
		return this.fileParser;
	}
	public void setFileParser(FileParser fileParser){
		this.fileParser = fileParser;
	}	
	
	//字段
	private List<Field> fieldList = null;
	public List<Field> getFieldList(){
		return this.fieldList;
	}
	public void setFieldList(List<Field> fieldList){
		this.fieldList = fieldList;
	}
	
	private HashMap<String, Field> dbFieldNameToFields = null;
	
	public Field getField(String dbFieldName){
		if(this.dbFieldNameToFields == null){
			HashMap<String, Field> dbFieldNameToFields = new HashMap<String, Field>();
			for(int i = 0; i < this.fieldList.size(); i++){
				Field field = this.fieldList.get(i);
				dbFieldNameToFields.put(field.getDbFieldName(), field);				
			}
			this.dbFieldNameToFields = dbFieldNameToFields;
		}
		return this.dbFieldNameToFields.containsKey(dbFieldName) ? this.dbFieldNameToFields.get(dbFieldName) : null;
	}
}
