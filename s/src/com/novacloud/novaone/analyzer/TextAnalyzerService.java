package com.novacloud.novaone.analyzer;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;
import org.apache.lucene.analysis.tokenattributes.OffsetAttribute;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.FieldType;
import org.apache.lucene.index.AtomicReader;
import org.apache.lucene.index.AtomicReaderContext;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.DocsEnum;
import org.apache.lucene.index.Fields;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Terms;
import org.apache.lucene.index.TermsEnum;
import org.apache.lucene.search.DocIdSetIterator;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.BytesRef;
import org.apache.lucene.util.Version;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCreationHelper;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.wltea.analyzer.lucene.IKAnalyzer;

import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.expression.definition.Parameter;
import com.novacloud.novaone.expression.definition.RunAt;
import com.novacloud.novaone.expression.definition.ValidateResult;
import com.novacloud.novaone.expression.definition.Validator;
import com.novacloud.novaone.expression.run.RunResult;
import com.novacloud.novaone.expression.run.Runner;
import com.opensymphony.xwork2.ActionSupport;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class TextAnalyzerService  extends NcpActionSupport {
	
	/** 
	 * 获取分词后term的位置信息
	 * @param word 分词的文本
	 * */
	public String position(){ 
		try{
			//输入参数
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String text = CommonFunction.decode(requestObj.getString("text")); 
			
			Analyzer analyzer=new IKAnalyzer();//IK分词
			TokenStream token=analyzer.tokenStream("a", new StringReader(text));
			token.reset();
			CharTermAttribute term=token.addAttribute(CharTermAttribute.class);//term信息
			OffsetAttribute offset=token.addAttribute(OffsetAttribute.class);//位置数据
			StringBuilder s= new StringBuilder();
			while(token.incrementToken()){
			  s.append(term +"   "+offset.startOffset()+"   "+offset.endOffset() + "\r\n");
			}
			token.end();
			token.close(); 
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("succeed",true); 
			resultHash.put("info", CommonFunction.encode(s.toString()));
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("position", "分词定位失败.", ex);
			this.addResponse(ncpEx.toJsonString());
		} 	 
		return ActionSupport.SUCCESS;
	}
	
	/*
	 * 获取目录下所有文件
	 * */
	private List<File> getAllFiles(String dir){
		File file=new File(dir);
		File[] tempList = file.listFiles(); 
		List<File> allFilePathes = new ArrayList<File>();
		for (int i = 0; i < tempList.length; i++) {
			File f = tempList[i];
			if (f.isFile()) {
				allFilePathes.add(f);
			}
		}
		return allFilePathes;
	}
	
	/**
	 * 建立索引
	 * @throws Exception 
	 * 
	 * **/
    public List<String> getAllText(String fileDir) throws Exception{
		List<String> allText = new ArrayList<String>();
		List<File> allFiles = this.getAllFiles(fileDir);
		for(int i=0;i<allFiles.size();i++){
			File f = allFiles.get(i);
			InputStreamReader read = null;
			BufferedReader bufferedReader = null;
			try {
				read = new InputStreamReader(new FileInputStream(f), "utf-8");
                bufferedReader = new BufferedReader(read);
                StringBuilder textStr = new StringBuilder();
                String lineTxt = null;
                while((lineTxt = bufferedReader.readLine()) != null){ 
            		textStr.append(new String(lineTxt.getBytes()));
                }
                String text = textStr.toString();//.substring(1).replace("\"", " ").trim(); 
                allText.add(text); 
			}
			catch(Exception ee){
				throw ee;
			}
			finally{
				if(bufferedReader != null){
					bufferedReader.close();
				}
				if(read != null){
					read.close();
				} 
			}
		}
		return allText;
	}
	
	/**
	 * 建立索引
	 * @throws IOException 
	 * 
	 * **/
    public void createIndex(Directory indexDirectroy, List<String> allText ) throws IOException{
		Analyzer analyzer=new IKAnalyzer();//IK分词
        IndexWriterConfig iwc = new IndexWriterConfig(Version.LUCENE_CURRENT, analyzer);    
		IndexWriter writer = new IndexWriter(indexDirectroy, iwc);
		writer.deleteAll();
		for(int i=0;i<allText.size();i++){  
			Document doc = new Document();  
			FieldType ft=new FieldType();
			ft.setIndexed(true);//存储
			ft.setStored(true);//索引
			ft.setStoreTermVectors(true);
			ft.setTokenized(true);
			ft.setStoreTermVectorPositions(true);//存储位置
			ft.setStoreTermVectorOffsets(true);//存储偏移量
			doc.add(new Field("content",allText.get(i),ft));
			writer.addDocument(doc);
		}
		writer.close();  
	}
	
	/**
	 * 读取索引，显示词频
	 * 
	 * **/
    public void getTF(){

		String text = null;
		try{
			//输入参数
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String dir = CommonFunction.decode(requestObj.getString("dir"));  
			StringBuilder s = new StringBuilder();
			String fileDir = dir + "\\file";
			String indexDir = dir + "\\index";
			String outputDir = dir + "\\output";
			Directory indexDirectroy = FSDirectory.open(new File(indexDir));  
			 
			List<String> allText = this.getAllText(fileDir);
			
			this.createIndex(indexDirectroy, allText);
			IndexReader reader= DirectoryReader.open(indexDirectroy); 
			
			for (int i = 0; i < reader.numDocs(); i++) { 
				text = allText.get(i); 
				if(text.length() != 0){
		            int docId = i;
		            s.append("第"+(i+1)+"篇文档：\r\n");
		            StringBuilder os = new StringBuilder();
		            os.append("Content：\r\n"+ text +"\r\n");
		            Fields fs = reader.getTermVectors(docId);
		            if(fs != null){
			            Terms terms = fs.terms("content");   
			            TermsEnum termsEnum = terms.iterator(null);
			            BytesRef thisTerm = null;
			            while ((thisTerm = termsEnum.next()) != null) {
			            	String termText = thisTerm.utf8ToString(); 
			            	if(!termText.equals("\"")){
				                DocsEnum docsEnum = termsEnum.docs(null, null);
				                while ((docsEnum.nextDoc()) != DocIdSetIterator.NO_MORE_DOCS) {                  
				                	os.append(termText + " TF: " + docsEnum.freq() + "\r\n"); 
				                } 
			            	}
		                }
			            s.append(os.toString() + "\r\n"); 
			            
			            //输出TF结果
						OutputStreamWriter w = null;
						BufferedWriter bufferedWriter = null;
						try {
							String oFilePath  = outputDir + "\\" + i + ".txt";
							w = new OutputStreamWriter(new FileOutputStream(oFilePath), "utf-8");
							bufferedWriter = new BufferedWriter(w); 
			                bufferedWriter.write(os.toString()); 
			                bufferedWriter.flush(); 
						}
						catch(Exception ee){
							throw ee;
						}
						finally{
							if(bufferedWriter != null){
								bufferedWriter.close();
							}
							if(w != null){
								w.close();
							} 
						}
		
		            }
				}
			}
			reader.close();
			indexDirectroy.close(); 
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("succeed",true); 
			resultHash.put("info", "Succeed!");
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);	  
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getTF", "计算词频失败.", ex);
			this.addResponse(ncpEx.toJsonString());
		} 	 		
	}
    /**
     * 计算IDF
     * 
     * **/
	public void getIDF(){
		
		try{
			//输入参数
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String dir = CommonFunction.decode(requestObj.getString("dir"));  
			StringBuilder s = new StringBuilder();
			String fileDir = dir + "\\file";
			String indexDir = dir + "\\index";
			Directory indexDirectroy = FSDirectory.open(new File(indexDir));  
			 
			List<String> allText = this.getAllText(fileDir);
			
			this.createIndex(indexDirectroy, allText);
			
			//工作簿
		    XSSFWorkbook hssfworkbook=new XSSFWorkbook();
			//获得CreationHelper对象,这个应该是一个帮助类   
			XSSFCreationHelper helper=hssfworkbook.getCreationHelper();
			//创建sheet页
			XSSFSheet hssfsheet=hssfworkbook.createSheet();		     
			//设置sheet名称
			hssfworkbook.setSheetName(0,"IDF"); 
			//取得第一行 
			XSSFRow firstRow=hssfsheet.createRow(0); 
			//创建单元格
			XSSFCell hssfcell_text=firstRow.createCell(0); 
			hssfcell_text.setCellValue("text");
			XSSFCell hssfcell_docFreq=firstRow.createCell(1); 
			hssfcell_docFreq.setCellValue("docFreq");
			XSSFCell hssfcell_totalTermFreq=firstRow.createCell(2); 
			hssfcell_totalTermFreq.setCellValue("totalTermFreq");
			 
			IndexReader reader= DirectoryReader.open(indexDirectroy);
			List<AtomicReaderContext>  list=reader.leaves();
			for(int i=0;i<list.size();i++){
				AtomicReaderContext ar = list.get(i); 
				String field="content";
				AtomicReader areader=ar.reader();
				Terms term=areader.terms("content");
				TermsEnum tn=term.iterator(null); 
				  
			    BytesRef text;
			    while((text = tn.next()) != null) {    			   
			    	s.append("field=" + field + "; text=" + text.utf8ToString()+"   docFreq : "+tn.docFreq() +" totalTermFreq:  "+tn.totalTermFreq() + "\r\n");

					//取得第一行 
					XSSFRow row=hssfsheet.createRow(hssfsheet.getLastRowNum() + 1);
					row.createCell(0).setCellValue(text.utf8ToString());
					row.createCell(1).setCellValue(tn.docFreq());
					row.createCell(2).setCellValue(tn.totalTermFreq());
			    }
	            s.append("\r\n"); 	            
			}
			
			FileOutputStream fileoutputstream = null;
			try{
				fileoutputstream = new FileOutputStream(dir + "\\textAnalysis.xlsx"); 
				hssfworkbook.write(fileoutputstream); 
			}
			catch(Exception ee){
				throw ee;
			}
			finally{
				if(fileoutputstream != null){
					fileoutputstream.close();
				}
			}
			reader.close();
			indexDirectroy.close();
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("succeed",true); 
			resultHash.put("info", "Succeed!");
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getIDF", "计算IDF失败.", ex);
			this.addResponse(ncpEx.toJsonString());
		} 	 			
	}
}
