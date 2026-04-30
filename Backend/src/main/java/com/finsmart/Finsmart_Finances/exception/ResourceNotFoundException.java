package com.finsmart.Finsmart_Finances.exception;

public class ResourceNotFoundException extends BusinessException{
	public ResourceNotFoundException(String resourcename,Long id) {
		super(resourcename + " not found with ID: " + id);
	}
	public ResourceNotFoundException(String resourcename, String value) {
		super(resourcename + " not found with value: " + value);
	}
}
