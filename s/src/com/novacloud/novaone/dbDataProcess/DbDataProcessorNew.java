package com.novacloud.novaone.dbDataProcess;
 
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.joda.time.DateTime;

import com.novacloud.novaone.common.FileOperate;
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.IAccessoryDao;
import com.novacloud.novaone.dataFile.DataFileProcessor;
import com.novacloud.novaone.dataFile.FileBaseProcessor;
import com.novacloud.novaone.dataFile.FileType;
import com.novacloud.novaone.dataFile.FileUseType;
import com.novacloud.novaone.dataFile.IFileBaseProcessor;
import com.novacloud.novaone.dataFile.RootDirType;
import com.novacloud.novaone.excelGrid.definition.ConvertExcelToExcelGridProcessor;
import com.novacloud.novaone.excelGrid.definition.ExcelGrid;
import com.novacloud.novaone.excelGrid.definition.ExcelGridValidateResult;

import net.sf.json.JSONObject;  

public class DbDataProcessorNew extends FileBaseProcessor{
	
	class MyThread extends Thread{
		public List<DataRow> nameListRows = null;
		public List<DataRow> pilotBasicRows = null;
		public HashMap<String, HashMap<String, String[]>> nameListNames = null;
		public HashMap<String, HashMap<String, String[]>> pilotBasicNames = null;
		
		//执行数据库操作的通用类
		private IDBParserAccess dBParserAccess; 
		public void setDBParserAccess(IDBParserAccess dBParserAccess) {
			this.dBParserAccess = dBParserAccess;
		}  
		protected IDBParserAccess getDBParserAccess() {
			return this.dBParserAccess;
		}
		
		private Session dbSession = null;
		public Session getDBSession() {
			return dbSession;
		}
		public void setDBSession(Session dbSession) {
			this.dbSession = dbSession;
		}  
		public void run(){
			for(int i = 0; i < nameListRows.size(); i++){
				this.findMatched(getDBSession(), nameListRows.get(i), nameListNames, pilotBasicNames, pilotBasicRows);
			}
			DbDataProcessorNew.endThreadCount++;
		}

		
		private void findMatched(Session dbSession, DataRow nameListRow, HashMap<String, HashMap<String, String[]>> nameListNames, HashMap<String, HashMap<String, String[]>> pilotBasicNames, List<DataRow> pilotBasicRows){

			String nl_index = nameListRow.getStringValue("nl_index");
			
			HashMap<String, String[]> nameListHash = nameListNames.get(nl_index);

			String[] firstNameParts = nameListHash.get("firstName");
			String[] middleNameParts = nameListHash.get("middleName");
			String[] lastNameParts = nameListHash.get("lastName"); 
			String address = nameListHash.get("fullAddress")[0];  
					
			for(int j = 0; j < pilotBasicRows.size(); j++){
				DataRow pilotBasicRow = pilotBasicRows.get(j);
				String unique_id = pilotBasicRow.getStringValue("unique_id"); 
				
				HashMap<String, String[]> pilotBasicHash = pilotBasicNames.get(unique_id);

				String[] pilotFirstNameParts = pilotBasicHash.get("firstName"); 
				String[] pilotLastNameParts = pilotBasicHash.get("lastName");
				String pilotAddress = pilotBasicHash.get("fullAddress")[0];  
				boolean isSameFullAddress = this.isSameAddress(address, pilotAddress);
				if(isSameFullAddress){
					boolean isSameFirstName = this.isSame(firstNameParts, pilotFirstNameParts);
					if(isSameFirstName){
						boolean isSameLastName = this.isSame(lastNameParts, pilotLastNameParts);
						if(isSameLastName){
							boolean isSameMiddleName1 = this.isSameMiddle(middleNameParts, this.removeExist(firstNameParts, pilotFirstNameParts));
							boolean isSameMiddleName2 = this.isSameMiddle(middleNameParts,  this.removeExist(lastNameParts, pilotLastNameParts));
							if(isSameMiddleName1 || isSameMiddleName2){
								HashMap<String, Object> matchedNameToPilot = new HashMap<String, Object>();
								matchedNameToPilot.put("name_index", nl_index);
								matchedNameToPilot.put("pilot_unique_id", unique_id); 
								matchedNameToPilot.put("id", nl_index + "_" + unique_id);
								String insertNameToPilotSql = "insert into ie_user_umassd_new_name2pilot(id, pilot_unique_id, name_index) values(:id, :pilot_unique_id, :name_index)";
								this.getDBParserAccess().insert(dbSession, insertNameToPilotSql, matchedNameToPilot);
							}
						}
					}
				}
			}	
		}
		
		private String[] removeExist(String[] namePartsA, String[] namePartsB){
			if(namePartsA != null && namePartsB != null){
				List<String> names = new ArrayList<String>();
				for(int i = 0; i < namePartsB.length; i++){
					String namePartB = namePartsB[i]; 
					boolean matched = false;
					if(namePartB.trim().length() != 0){
						for(int j = 0; j < namePartsA.length; j++){
							String namePartA = namePartsA[j]; 
							if(namePartA.trim().length() != 0){
								if(namePartB.equals(namePartA)){
									matched = true;
									break;
								}
							}
						}
					}
					if(!matched){
						names.add(namePartB);
					}
				}
				String[] nameArray = new String[names.size()];
				for(int i = 0; i < names.size(); i++){
					nameArray[i] = names.get(i);
				}
				return nameArray;
			}
			return null;
		}
		
		private boolean isSame(String[] namePartsA, String[] namePartsB){
			if(namePartsA != null && namePartsB != null){
				for(int i = 0; i < namePartsA.length; i++){
					String namePartA = namePartsA[i]; 
					boolean matched = false;
					if(namePartA.trim().length() != 0){
						for(int j = 0; j < namePartsB.length; j++){
							String namePartB = namePartsB[j]; 
							if(namePartB.trim().length() != 0){
								if(namePartA.equals(namePartB)){
									matched = true;
									break;
								}
							}
						}
					}
					if(!matched){
						return false;
					}
				}
				return true;
			}
			return false;
		}
		
		private boolean isSameMiddle(String[] namePartsA, String[] namePartsB){
			if(namePartsA != null && namePartsB != null){
				for(int i = 0; i < namePartsA.length; i++){
					String namePartA = namePartsA[i]; 
					boolean matched = false;
					if(namePartA.trim().length() != 0){
						for(int j = 0; j < namePartsB.length; j++){
							String namePartB = namePartsB[j]; 
							if(namePartB.trim().length() != 0){
								if(namePartB.startsWith(namePartA)){
									matched = true;
									break;
								}
							}
						}
					}
					if(!matched){
						return false;
					}
				}
				return true;
			}
			return false;
		}  
	
		private boolean isSameAddress(String fullAddressA, String fullAddressB){
			if(fullAddressA != null && fullAddressA != null){ 
				return fullAddressA.equals(fullAddressB);
			} 
			return false;
		}    
	}
	
	public String getDefaultApplicationVersion(){
		return "1.0.0";
	}
	
	public String getDefaultApplicationName(){
		return "dbDataProcessor";
	}   

	public static int endThreadCount = 0;
	public static int threadCount = 0;
	 
	public void matchedPerson(INcpSession session) throws Exception {
		try{
			Session dbSession = this.getDBSession();
			String deleteSql = "delete from ie_user_umassd_new_name2pilot";
			this.getDBParserAccess().delete(dbSession, deleteSql, null);
			
			List<DataRow> nameListRows = this.getNameListRows();
			List<DataRow> pilotBasicRows = this.getPilotBasicRows(); 
	
			HashMap<String, HashMap<String, String[]>> nameListNames = new HashMap<String, HashMap<String, String[]>>();
			for(int i = 0; i < nameListRows.size(); i++){
				DataRow nameListRow = nameListRows.get(i);
				String nl_index = nameListRow.getStringValue("nl_index");
				String firstName = nameListRow.getStringValue("exec_fname");
				String middleName = nameListRow.getStringValue("exec_mname");
				String lastName = nameListRow.getStringValue("exec_lname");
				String address = nameListRow.getStringValue("address").toLowerCase().trim();
				String city = nameListRow.getStringValue("city").toLowerCase().trim();
				String state = nameListRow.getStringValue("state").toLowerCase().trim();
	
				String[] firstNameParts = this.splitString(firstName);
				String[] middleNameParts = this.splitString(middleName);
				String[] lastNameParts = this.splitString(lastName); 
				HashMap<String, String[]> namePartHash = new HashMap<String, String[]>();
				namePartHash.put("firstName", firstNameParts);
				namePartHash.put("middleName", middleNameParts);
				namePartHash.put("lastName", lastNameParts);
				//namePartHash.put("fullAddress", new String[]{ address + "," + city + "," + state  }); 
				namePartHash.put("fullAddress", new String[]{ state}); 
				nameListNames.put(nl_index, namePartHash);
			} 
			
			HashMap<String, HashMap<String, String[]>> pilotBasicNames = new HashMap<String, HashMap<String, String[]>>();
			for(int i = 0; i < pilotBasicRows.size(); i++){
				DataRow pilotBasicRow = pilotBasicRows.get(i);
				String unique_id = pilotBasicRow.getStringValue("unique_id"); 
				String firstName = pilotBasicRow.getStringValue("first_name"); 
				String lastName = pilotBasicRow.getStringValue("last_name");
				String address = pilotBasicRow.getStringValue("address").trim();
				String city = pilotBasicRow.getStringValue("city").trim();
				String state = pilotBasicRow.getStringValue("state").trim();
	
				String[] firstNameParts = this.splitString(firstName); 
				String[] lastNameParts = this.splitString(lastName); 
				HashMap<String, String[]> namePartHash = new HashMap<String, String[]>();
				namePartHash.put("firstName", firstNameParts); 
				namePartHash.put("lastName", lastNameParts);
				//namePartHash.put("fullAddress", new String[]{ address + "," + city + "," + state  });
				namePartHash.put("fullAddress", new String[]{ state});
				pilotBasicNames.put(unique_id, namePartHash);
			}
	
			int onePageItemCount = 5000;
			int nameListCount = nameListRows.size();
			int nameListPageCount = nameListCount / onePageItemCount + 1;
			
			for(int i = 0; i < nameListPageCount; i++){
				MyThread myThread = new MyThread();
				myThread.setDBParserAccess(getDBParserAccess());
				myThread.setDBSession(getDBSession());
				
				int fromIndex = i * onePageItemCount;
				int toIndex = ((i + 1) * onePageItemCount > nameListCount) ? (nameListCount ) : ((i + 1) * onePageItemCount );
				List<DataRow> subNameListRows = nameListRows.subList(fromIndex, toIndex);

				myThread.nameListRows = subNameListRows;
				myThread.nameListNames = nameListNames;
				
				myThread.pilotBasicNames = pilotBasicNames;
				myThread.pilotBasicRows = pilotBasicRows;
				
				myThread.start();
			}
			DbDataProcessorNew.threadCount = nameListPageCount;
			while(DbDataProcessorNew.threadCount != DbDataProcessorNew.endThreadCount){
				Thread.sleep(3000);
			}
			 
			/*
			StringBuilder sqls = new StringBuilder();
			for(int i = 0; i < matchedNameToPilots.size(); i++){
				HashMap<String, Object> matchedNameToPilot = matchedNameToPilots.get(i);
				String pilot_unique_id = matchedNameToPilot.get("pilot_unique_id").toString();
				String name_co_per_rol = matchedNameToPilot.get("name_co_per_rol").toString();
				String id = name_co_per_rol + "_" + pilot_unique_id;
				sqls.append("insert into ie_user_umassd_name2pilot(id, pilot_unique_id, name_co_per_rol) values('" + id + "', '" + pilot_unique_id + "', '" + name_co_per_rol + "');\r\n");
			}
			
			FileOperate fo = new FileOperate();
			fo.createFile("d:\\insert_ie_user_umassd_name2pilot.sql", sqls.toString());
				*/		
			/*
			String insertNameToPilotSql = "insert into ie_user_umassd_name2pilot(id, pilot_unique_id, name_co_per_rol) values(:id, :pilot_unique_id, :name_co_per_rol)";
			for(int i = 0; i < matchedNameToPilots.size(); i++){
				HashMap<String, Object> matchedNameToPilot = matchedNameToPilots.get(i);
				matchedNameToPilot.put("id", ValueConverter.dateTimeToString(new Date(), "yyyyMMddHHmmssSSS"));
				this.getDBParserAccess().insert(dbSession, insertNameToPilotSql, matchedNameToPilot);
			}
			*/
		}
		catch(Exception ex){
			throw ex;
		}
	}
	
	private String[] splitString(String sourceString){
		if(sourceString == null){
			return null;
		}
		else{
			String tempSourceString = sourceString.toLowerCase().replace("(", " ").replace(")", " ").replace(".", " ").replace(",", " ");
			String[] resultStrings = tempSourceString.split(" ");
			return resultStrings;
		}
	}
	
	private List<DataRow> getNameListRows() throws SQLException{
		Session dbSession = this.getDBSession();
		String nameListSql = "select n.id as id, n.nl_index as nl_index, n.exec_fname as exec_fname, n.exec_mname as exec_mname, n.exec_lname as exec_lname, n.address as address, n.city as city, n.state as state from ie_user_umassd_new_name_list n"
				+ " where n.address is not null and n.city is not null and n.state is not null";
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("nl_index");
		alias.add("exec_fname");
		alias.add("exec_mname");
		alias.add("exec_lname");
		alias.add("address");
		alias.add("city");
		alias.add("state");
		Map<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("nl_index", ValueType.String);
		fieldValueTypes.put("exec_fname", ValueType.String);
		fieldValueTypes.put("exec_mname", ValueType.String);
		fieldValueTypes.put("exec_lname", ValueType.String);
		fieldValueTypes.put("address", ValueType.String);
		fieldValueTypes.put("city", ValueType.String);
		fieldValueTypes.put("state", ValueType.String);
		DataTable nameListTable = this.getDBParserAccess().selectList(dbSession, nameListSql, null, alias, fieldValueTypes);
		List<DataRow> nameListRows = nameListTable.getRows();
		return nameListRows;
	}
	
	private List<DataRow> getPilotBasicRows() throws SQLException{
		Session dbSession = this.getDBSession();
		String pbSql = "select pb.id as id, pb.unique_id as unique_id, pb.first_name as first_name, pb.last_name as last_name, pb.street1 as address, pb.city as city, pb.state as state from ie_user_umassd_pilot_basic pb";
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("unique_id");
		alias.add("first_name"); 
		alias.add("last_name");
		alias.add("address");
		alias.add("city");
		alias.add("state");
		Map<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("unique_id", ValueType.String);
		fieldValueTypes.put("first_name", ValueType.String); 
		fieldValueTypes.put("last_name", ValueType.String);
		fieldValueTypes.put("address", ValueType.String);
		fieldValueTypes.put("city", ValueType.String);
		fieldValueTypes.put("state", ValueType.String);
		DataTable nameListTable = this.getDBParserAccess().selectList(dbSession, pbSql, null, alias, fieldValueTypes);
		List<DataRow> nameListRows = nameListTable.getRows();
		return nameListRows;
	}

	@Override
	public String createNewFile(INcpSession session, String name, String fileTypeName, String parentId, boolean isSys,
			boolean isHidden, FileUseType useType) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}
}