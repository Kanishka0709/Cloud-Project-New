package com.finsmart.Finsmart_Finances.exception;

public class UsernameAlreadyExistException extends DuplicateResourceException{
	public UsernameAlreadyExistException(String username) {
		super("User","username",username);
	}

}
