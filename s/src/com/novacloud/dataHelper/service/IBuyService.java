package com.novacloud.dataHelper.service;

public interface IBuyService {

	String addToCart() throws Exception;

	String removeFromCart() throws Exception;

	String getCartList() throws Exception;

	String getCartLineCount() throws Exception;

	String generateOrder() throws Exception; 

	String closeOrder() throws Exception;

	String getOrderList() throws Exception;

	String getOrderDetail() throws Exception;

	String getUnitPrice() throws Exception;

}
