package com.novacloud.dataHelper.service;

public interface IUserService {

	String regUser() throws Exception;

	String forgetPwd() throws Exception;

	String forgetChangePwd() throws Exception;

	String changePwd() throws Exception;

}
