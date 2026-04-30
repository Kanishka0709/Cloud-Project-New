package com.finsmart.Finsmart_Finances.exception;

public class UserNotfoundException extends ResourceNotFoundException {
	public UserNotfoundException(Long id) {
		super("User",id);
	}
	public UserNotfoundException(String username) {
		super("User", username);
	}
}
