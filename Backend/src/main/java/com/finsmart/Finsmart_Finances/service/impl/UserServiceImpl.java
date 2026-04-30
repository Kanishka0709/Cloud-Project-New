package com.finsmart.Finsmart_Finances.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.finsmart.Finsmart_Finances.dto.UserDTO;
import com.finsmart.Finsmart_Finances.exception.BusinessException;
import com.finsmart.Finsmart_Finances.exception.DataIntegrityViolationException;
import com.finsmart.Finsmart_Finances.exception.EmailAlredyExistException;
import com.finsmart.Finsmart_Finances.exception.UserNotfoundException;
import com.finsmart.Finsmart_Finances.exception.UsernameAlreadyExistException;
import com.finsmart.Finsmart_Finances.model.User;
import com.finsmart.Finsmart_Finances.model.UserPrinciple;
import com.finsmart.Finsmart_Finances.repository.UserRepository;
import com.finsmart.Finsmart_Finances.service.UserService;


@Service
public class UserServiceImpl implements UserService
{
	
	
	
	@Autowired
	private final UserRepository userRepo;
	
	@Autowired
	private final ModelMapper MM;
	
    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

	
	@Autowired
	public UserServiceImpl(UserRepository userRepository, ModelMapper mm) {
        this.userRepo = userRepository;
        this.MM = mm;
    }
	
	
	public UserDTO converttoDTO(User u) {
		return MM.map(u, UserDTO.class);
	}
	
	public User converttoEntity(UserDTO userdto) {
		return MM.map(userdto, User.class);
	}
	
	
	@Override
	public UserDTO createUser(User u) {
		
		
		if(u == null) {
			log.error("createUser() failed: User object is null");
			throw new IllegalArgumentException("User Cannot Be null");
		}
		
		if(userRepo.existsByEmail(u.getEmail())) {
			log.warn("Email {} already exists", u.getEmail());
			throw new EmailAlredyExistException(u.getEmail());
		}
		
		if(userRepo.existsByUsername(u.getUsername())) {
			log.warn("Username {} already exists", u.getUsername());
			throw new UsernameAlreadyExistException(u.getUsername());
		}
		
		try {
			BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
			
			
			
			
			u.setPassword(encoder.encode(u.getPassword()));
			User saved = userRepo.save(u);
			log.info("User created successfully with id={}", saved.getId());			
			return converttoDTO(saved);
		}catch(DataIntegrityViolationException e) {
			throw new DataIntegrityViolationException("Failed to create user due to data integrity violation");
		}
		
	}

	@Override
	public Optional<UserDTO> getUserById(Long id) {
		log.info("getUserById() called with id={}", id);
		User u = userRepo.findById(id).orElseThrow(() -> new UserNotfoundException(id) );
		return Optional.ofNullable(converttoDTO(u));
	}

	@Override
	public List<UserDTO> getAllUser() {
		log.info("getAllUser() called");
		try {
			return userRepo.findAll().stream().map(this::converttoDTO).collect(Collectors.toList());
		}catch(Exception e) {
			log.error("Failed to retrieve users: {}", e.getMessage(), e);
			throw new BusinessException("Failed to retrieve users: " + e.getMessage());
		}
	}


	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		log.info("loadUserByUsername() called with username={}", username);
		System.out.println(username);
		User u = userRepo.findByUsername(username);
		System.out.println(u.getUsername());
		
		return new UserPrinciple(u);
	}

	@Override
	public UserDTO updateUserByUsername(String username, UserDTO userDTO) {
		User user = userRepo.findByUsername(username);
		if (user == null) {
			log.warn("User with username {} not found", username);
			throw new UserNotfoundException(username);
		}
		// Update fields (except username and id)
		if (userDTO.getFirstName() != null) user.setFirstName(userDTO.getFirstName());
		if (userDTO.getLastName() != null) user.setLastName(userDTO.getLastName());
		if (userDTO.getEmail() != null) user.setEmail(userDTO.getEmail());
		if (userDTO.getAddress() != null) user.setAddress(userDTO.getAddress());
		if (userDTO.getContactNumber() != null) user.setContactNumber(userDTO.getContactNumber());
		if (userDTO.getCity() != null) user.setCity(userDTO.getCity());
		if (userDTO.getState() != null) user.setState(userDTO.getState());
		User saved = userRepo.save(user);
		log.info("User with username {} updated successfully", username);
		return converttoDTO(saved);
	}

	@Override
	public UserDTO getUserByUsername(String username) {
		log.info("getUserByUsername() called with username={}", username);
		User user = userRepo.findByUsername(username);
		if (user == null) {
			log.warn("User with username {} not found", username);
			throw new UserNotfoundException(username);
		}
		return converttoDTO(user);
	}

	@Override
	public User findUserByUsername(String username) {
		log.info("findUserByUsername() called with username={}", username);
		User user = userRepo.findByUsername(username);
		if (user == null) {
			log.warn("User with username {} not found", username);
			throw new UserNotfoundException(username);
		}
		return user;
	}

}
