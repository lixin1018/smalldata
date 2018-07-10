package com.novacloud.novaone.nosql;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress; 

public class mongodbProcessor {
	
	private String dBServerName;
	public String getdBServerName() {
		return dBServerName;
	}
	public void setdBServerName(String dBServerName) {
		this.dBServerName = dBServerName;
	}
	
	private int dBPort;
	public int getdBPort() {
		return dBPort;
	}
	public void setdBPort(int dBPort) {
		this.dBPort = dBPort;
	}
	
	private String dBName;
	public String getdBName() {
		return dBName;
	}
	public void setdBName(String dBName) {
		this.dBName = dBName;
	}
	
	private String userName;
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	
	private String password;
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	
	private MongoDatabase getDBConnection(){
		try {  
			//连接到MongoDB服务 如果是远程连接可以替换“localhost”为服务器所在IP地址  
            //ServerAddress()两个参数分别为 服务器地址 和 端口  
            ServerAddress serverAddress = new ServerAddress(this.getdBServerName(), this.getdBPort());  
            List<ServerAddress> addrs = new ArrayList<ServerAddress>();  
            addrs.add(serverAddress);  
              
            //MongoCredential.createScramSha1Credential()三个参数分别为 用户名 数据库名称 密码  
            MongoCredential credential = MongoCredential.createScramSha1Credential(this.getUserName(), this.getdBName(), this.getPassword().toCharArray());  
            List<MongoCredential> credentials = new ArrayList<MongoCredential>();  
            credentials.add(credential);  
              
            //通过连接认证获取MongoDB连接  
            MongoClient mongoClient = new MongoClient(addrs, credentials);  
              
            //连接到数据库  
            MongoDatabase mongoDatabase = mongoClient.getDatabase(this.getdBName());  
            System.out.println("Connect to mongodb database " + this.getdBName() + " successfully.");  
            
            return mongoDatabase;
		} 
		catch (Exception e) {  
            System.out.println("Connect to mongodb database " + this.getdBName() + " failed.");  
			System.err.println( e.getClass().getName() + ": " + e.getMessage() );  
			throw e;
	  	} 
	}

	public MongoCollection<Document> createCollection(String collectionName){
		try{
			MongoDatabase mdb = this.getDBConnection();
			 
			MongoCollection<Document> collection = mdb.getCollection(collectionName);
			
			if(collection == null){
				mdb.createCollection(collectionName);
				collection = mdb.getCollection(collectionName);
			}
			
			return collection;
		}
		catch(Exception e){
            System.out.println("Create collection " + this.getdBName() + " failed.");  
			System.err.println( e.getClass().getName() + ": " + e.getMessage() );  
			throw e;
		}
	}
	
	


}
