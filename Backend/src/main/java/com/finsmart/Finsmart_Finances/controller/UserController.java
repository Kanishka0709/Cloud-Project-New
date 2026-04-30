package com.finsmart.Finsmart_Finances.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finsmart.Finsmart_Finances.dto.UserDTO;
import com.finsmart.Finsmart_Finances.model.User;
import com.finsmart.Finsmart_Finances.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // the reason we use this is beacuse of SOP if don;t use this we 
							// we won't be able to make the cross Platform API calls 
public class UserController {

    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public UserDTO adduser(@Valid @RequestBody User u) {
    	logger.info("Request received to create user: {}", u.getUsername());
    	return userService.createUser(u);
    	
    }
    
    @GetMapping("/{id}")
    public Optional<UserDTO> getbyid(@PathVariable Long id) {
    	 logger.info("Fetching user with ID: {}", id);
         Optional<UserDTO> user = userService.getUserById(id);
         if (user.isPresent()) {
             logger.info("User found: {}", user.get().getUsername());
         } else {
             logger.warn("User with ID {} not found", id);
         }
         return user;
    }
    
    @GetMapping
    public List<UserDTO> getall(){
    	return userService.getAllUser();
    }
    
    @PutMapping("/{username}")
    public UserDTO updateUserByUsername(@PathVariable String username, @RequestBody UserDTO userDTO) {
        logger.info("Updating user with username: {}", username);
        return userService.updateUserByUsername(username, userDTO);
    }
    
}
