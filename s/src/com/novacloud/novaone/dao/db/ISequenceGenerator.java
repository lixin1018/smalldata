package com.novacloud.novaone.dao.db;

import java.util.List; 

public interface ISequenceGenerator {
	List<String> getIdSequence( String tableName, int count) throws RuntimeException;
    List<String> getFieldSequence( String tableName, String fieldName, String prefix, String postfix,int seqNumLength, int count) throws RuntimeException ;   
}
