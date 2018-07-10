package com.novacloud.novaone.excelGrid.definition;

public class ValidateException extends Exception {
	public ValidateException(ValidateResult vr){
		this.vr =vr;
	}
	private ValidateResult vr = null;
	public ValidateResult getValidateResult(){
		return this.vr;
	}
	
	public String toString(){
		String errors = this.vr.getError();
		String alerts = this.vr.getAlert();
		return "errors: " + errors + "\r\n" + "alert: " + alerts; 
	}
}
