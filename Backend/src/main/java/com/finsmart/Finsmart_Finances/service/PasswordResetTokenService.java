package com.finsmart.Finsmart_Finances.service;

public interface PasswordResetTokenService {

	public void generateResetToken(String email);
	public void sendEmail(String to, String token);
	public void resetPassword(String token, String newPassword);
}
