package com.novacloud.novaone.expression.run; 
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DownList;
import com.novacloud.novaone.model.sysmodel.ParamWin;
import com.novacloud.novaone.model.sysmodel.Sheet;
import com.novacloud.novaone.model.sysmodel.Tree;
import com.novacloud.novaone.model.sysmodel.View;

public interface ISystemModelAccess {
	Data getData(String name);
	Sheet getSheet(String name);
	View getView(String name);
	Tree getTree(String name);
	DownList getDownList(String name);
	ParamWin getParamWin(String name); 
}
