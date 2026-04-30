package com.finsmart.Finsmart_Finances.exception;

public class ResourceNotPresent extends BusinessException{
	
	public ResourceNotPresent(String resourcename, String username) {
		super(resourcename + " not found with username " + username);
	}

}
