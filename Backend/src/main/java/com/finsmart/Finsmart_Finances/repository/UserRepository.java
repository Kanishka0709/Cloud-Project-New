package com.finsmart.Finsmart_Finances.repository;

import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;

import com.finsmart.Finsmart_Finances.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	User findByEmail(String email);
	User findByUsername(String username);
	boolean existsByUsername(String username);
	boolean existsByEmail(String email);

}
