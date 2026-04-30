package com.finsmart.Finsmart_Finances.service.impl;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.finsmart.Finsmart_Finances.exception.ResourceisNotthere;
import com.finsmart.Finsmart_Finances.model.PasswordResetToken;
import com.finsmart.Finsmart_Finances.model.User;
import com.finsmart.Finsmart_Finances.repository.PasswordResetTokenRepository;
import com.finsmart.Finsmart_Finances.repository.UserRepository;
import com.finsmart.Finsmart_Finances.service.PasswordResetTokenService;

import jakarta.transaction.Transactional;

@Service
public class PasswordResetTokenServiceImpl implements PasswordResetTokenService{
	
	private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
	
	
	@Autowired
	public PasswordResetTokenServiceImpl(PasswordResetTokenRepository tokenRepository, UserRepository userRepository,
			JavaMailSender mailSender) {
		super();
		this.tokenRepository = tokenRepository;
		this.userRepository = userRepository;
		this.mailSender = mailSender;
	}
	
	@Override
	public void generateResetToken(String email) {
        // check if user exists
		
		if(email.isEmpty()) {
			throw new IllegalArgumentException();
		}
        User userOpt = userRepository.findByEmail(email);
        if (userOpt == null) {
        	throw new ResourceisNotthere("User", email);
        }

        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(30); // expires in 30 minutes

        PasswordResetToken resetToken = new PasswordResetToken(token, email, expiry);
        tokenRepository.save(resetToken);

        // send mail
        sendEmail(email, token);
    }
	
	@Override
	public void sendEmail(String to, String token) {
	    String subject = "Password Reset Request";
	    String resetLink = "http://localhost:3000/reset-password?token=" + token;
	    String message = "To reset your password, click the link below or use the following token:\n\n" +
	            resetLink +
	            "\n\nIf you cannot click the link, copy and paste it into your browser.\n\n" +
	            "Alternatively, you can use this token: " + token +
	            "\n\nThis token is valid for 30 minutes.";

	    SimpleMailMessage mail = new SimpleMailMessage();
	    mail.setTo(to);
	    mail.setSubject(subject);
	    mail.setText(message);
	    mail.setFrom("finsmartfinances8@gmail.com"); // Set the sender explicitly

	    mailSender.send(mail);
	}

	
	@Override
	@Transactional
    public void resetPassword(String token, String newPassword) {
		
        PasswordResetToken resetToken = tokenRepository.findByToken(token);
        
        if(resetToken == null) {
        	throw new RuntimeException("No entry found for the given token");
        	
        }
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);      

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.deleteByToken(token);
            throw new RuntimeException("Token expired");
        }

        String email = resetToken.getEmail();
        User user = userRepository.findByEmail(email);
        if(user == null) {
        	throw new ResourceisNotthere("User", email);
        }

        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.deleteByToken(token); // remove token after use
   }

}
