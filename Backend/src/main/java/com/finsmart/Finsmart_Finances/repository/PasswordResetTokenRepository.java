package com.finsmart.Finsmart_Finances.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finsmart.Finsmart_Finances.model.PasswordResetToken;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
	PasswordResetToken findByToken(String Token);
	void deleteByToken(String token);
	
}
