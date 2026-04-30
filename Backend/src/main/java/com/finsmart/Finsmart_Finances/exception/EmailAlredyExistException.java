package com.finsmart.Finsmart_Finances.exception;

public class EmailAlredyExistException extends DuplicateResourceException{
	public EmailAlredyExistException(String email) {
		super("User","email", email);
	}
}
