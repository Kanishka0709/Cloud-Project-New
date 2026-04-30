package com.finsmart.Finsmart_Finances.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.finsmart.Finsmart_Finances.dto.UserDTO;
import com.finsmart.Finsmart_Finances.model.User;

public interface UserService extends UserDetailsService{
	UserDTO createUser(User u);
	Optional<UserDTO> getUserById(Long id);
	List<UserDTO> getAllUser();
	UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
	UserDTO updateUserByUsername(String username, UserDTO userDTO);
	UserDTO getUserByUsername(String username);
	User findUserByUsername(String username);

}
