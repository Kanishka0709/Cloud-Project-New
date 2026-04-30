package com.finsmart.Finsmart_Finances.exception;

public class ResourceisNotthere extends BusinessException{
	
	public ResourceisNotthere(String resourcename, String email) {
		super(resourcename + " not found with email " + email);	
	}

}
