package com.finsmart.Finsmart_Finances.exception;

public class DuplicateResourceException extends BusinessException{
	public DuplicateResourceException(String resourcename, String field,String  value) {
		super(resourcename + " with "+field+ " "+value + " already Exists");
		
	}

}
