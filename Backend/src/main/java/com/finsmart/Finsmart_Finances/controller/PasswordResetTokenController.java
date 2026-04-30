package com.finsmart.Finsmart_Finances.controller;


import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finsmart.Finsmart_Finances.service.PasswordResetTokenService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PasswordResetTokenController {
	private final PasswordResetTokenService passwordResetService;
	private static final Logger logger = LoggerFactory.getLogger(PasswordResetTokenController.class);
	
	

    

	public PasswordResetTokenController(PasswordResetTokenService passwordResetService) {
		
		this.passwordResetService = passwordResetService;
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<?> requestReset(@RequestBody Map<String, String> payload) {
	    String email = payload.get("email");
	    passwordResetService.generateResetToken(email);
	    return ResponseEntity.ok(Map.of("message", "Password reset token sent to email"));
	}


	@PostMapping("/reset-password")
	public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
	    String token = payload.get("token");
	    String newPassword = payload.get("newPassword");
	    passwordResetService.resetPassword(token, newPassword);
	    return ResponseEntity
	            .status(HttpStatus.CREATED)
	            .body(Map.of("message", "Reset link sent to your email"));
	}

	
}
