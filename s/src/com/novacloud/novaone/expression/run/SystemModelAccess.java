package com.novacloud.novaone.expression.run; 
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;
import com.novacloud.novaone.model.sysmodel.DownList;
import com.novacloud.novaone.model.sysmodel.DownListCollection;
import com.novacloud.novaone.model.sysmodel.ParamWin;
import com.novacloud.novaone.model.sysmodel.ParamWinCollection;
import com.novacloud.novaone.model.sysmodel.Sheet;
import com.novacloud.novaone.model.sysmodel.SheetCollection;
import com.novacloud.novaone.model.sysmodel.Tree;
import com.novacloud.novaone.model.sysmodel.TreeCollection;
import com.novacloud.novaone.model.sysmodel.View;
import com.novacloud.novaone.model.sysmodel.ViewCollection;

public class SystemModelAccess implements ISystemModelAccess {
	public Data getData(String name){
		return DataCollection.getData(name);
	}
	public Sheet getSheet(String name){
		return SheetCollection.getSheet(name);
	}
	public View getView(String name){
		return ViewCollection.getView(name);
	}
	public Tree getTree(String name){
		return TreeCollection.getTree(name);
	}
	public DownList getDownList(String name){
		return DownListCollection.getDownList(name);
	}
	public ParamWin getParamWin(String name){
		return ParamWinCollection.getParamWin(name);
	}
}
