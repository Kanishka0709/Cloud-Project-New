package com.finsmart.Finsmart_Finances.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.finsmart.Finsmart_Finances.dto.TaxProfileDTO;
import com.finsmart.Finsmart_Finances.exception.ResourceNotFoundException;
import com.finsmart.Finsmart_Finances.exception.ResourceNotPresent;
import com.finsmart.Finsmart_Finances.exception.UserNotfoundException;
import com.finsmart.Finsmart_Finances.model.TaxProfile;
import com.finsmart.Finsmart_Finances.model.User;
import com.finsmart.Finsmart_Finances.repository.TaxProfileRepository;
import com.finsmart.Finsmart_Finances.repository.UserRepository;
import com.finsmart.Finsmart_Finances.service.TaxProfileService;

@Service
public class TaxProfileServiceImpl implements TaxProfileService {

	private static final Logger log = LoggerFactory.getLogger(TaxProfileServiceImpl.class);
	
	private final ModelMapper mm;
	
	@Autowired
    private final TaxProfileRepository taxRepo;
	
	@Autowired
	private final UserRepository userepo;
	

	public TaxProfileServiceImpl(TaxProfileRepository taxRepo, ModelMapper mm, UserRepository userRepository) {
		this.taxRepo = taxRepo;
		this.mm = mm;
		this.userepo = userRepository;
	}
	
	
	private TaxProfileDTO converttodto(TaxProfile tt) {
		return mm.map(tt, TaxProfileDTO.class);
	}
	
	private TaxProfile converttomod(TaxProfileDTO td) {
		return mm.map(td, TaxProfile.class);
	}
	
	@Override
	public TaxProfileDTO saveTaxProfile(TaxProfile taxProfile) {
		double deduction;
		if(taxProfile == null) {
			log.warn("Invalid Tax Profile");
			throw new IllegalArgumentException("Invalid Tax Profile");
		}
		double annualincome = taxProfile.getAnnualIncome();
		if(annualincome >= 2400001) {
			deduction = annualincome*0.30;
		}
		else if(annualincome > 2000000 && annualincome <= 2400000 ) {
			deduction = annualincome*0.25;
		}
		else if(annualincome > 1600000 && annualincome <= 2000000 ) {
			deduction = annualincome*0.20;
		}
		else if(annualincome > 1200000 && annualincome <= 1600000 ) {
			deduction = annualincome*0.15;
		}
		else if(annualincome > 800000 && annualincome <= 1200000 ) {
			deduction = annualincome*0.10;
		}
		else if(annualincome > 400000 && annualincome <= 800000 ) {
			deduction = annualincome*0.05;
		}
		else {
			deduction = 0.0;
		}
		
		taxProfile.setDeductions(deduction);
		taxProfile.setTaxPaid(deduction);
		
		return converttodto(taxRepo.save(taxProfile));
	}

	@Override
	public List<TaxProfile> getAll() {
		return taxRepo.findAll();
	}

	@Override
	public Optional<TaxProfile> getById(Long id) {
		return taxRepo.findById(id);
	}

	@Override
	public List<TaxProfileDTO> getByUserId(Long userId) {
		System.out.println("=== TAX PROFILE SERVICE CALLED ===");
		System.out.println("User ID: " + userId);
		
		if(userId == null) {
			System.out.println("ERROR: User ID is null");
			log.warn("Invalid UserID");
			throw new IllegalArgumentException("Invalid UserID");
		}
		
		if(!userepo.existsById(userId)) {
			System.out.println("ERROR: User not found with ID: " + userId);
			log.warn("No user found with ID: {}",userId);
			throw new UserNotfoundException(userId);
		}
		
		System.out.println("User exists, looking for tax profiles...");
		List<TaxProfile> taxProfiles = taxRepo.findByUserId(userId);
		
		if(taxProfiles == null || taxProfiles.isEmpty()) {
			System.out.println("No tax profiles found for user: " + userId);
			log.info("No tax profiles found for user with UserId: {}", userId);
			return new ArrayList<>(); // Return empty list instead of null
		}
		
		System.out.println("Found " + taxProfiles.size() + " tax profiles, converting to DTOs...");
		List<TaxProfileDTO> taxProfileDTOs = taxProfiles.stream()
			.map(this::converttodto)
			.collect(Collectors.toList());
		
		System.out.println("Successfully converted " + taxProfileDTOs.size() + " profiles to DTOs");
		log.info("Found {} Tax Profiles for user with UserId: {}", taxProfileDTOs.size(), userId);
		
		return taxProfileDTOs;
	}

	@Override
	public void deleteTaxProfile(Long id) {
		if(!taxRepo.existsById(id)) {
			throw new ResourceNotFoundException("Tax Profile", id);
		}
		taxRepo.deleteById(id);
	}

	@Override
	public void deleteTaxProfileOfUser(Long userId) {
		if(userId == null) {
			log.warn("Invalid UserID");
			throw new IllegalArgumentException("Invalid UserID");
		}
		if(!userepo.existsById(userId)) {
			log.warn("No user found with ID: {}",userId);
			throw new UserNotfoundException(userId);
		}
		
		List<TaxProfile> taxProfiles = taxRepo.findByUserId(userId);
		if(taxProfiles == null || taxProfiles.isEmpty()) {
			log.warn("No Tax Profile found of the logged User");
			throw new ResourceNotFoundException("Tax Profile of User with UserId", userId);
		}
		
		// Delete the first tax profile (assuming one user has one tax profile)
		TaxProfile taxProfile = taxProfiles.get(0);
		taxRepo.delete(taxProfile);
	}

	@Override
	public User findbyusername(String username) {
		if(username == null) {
			log.warn("Username cannot be NULL");
			throw new IllegalArgumentException("Username cannot be null");
		}
		if(!userepo.existsByUsername(username)) {
			log.warn("No User Found with username");
			throw new ResourceNotPresent("User", username);
		}
		User user = userepo.findByUsername(username);
		
		return user;
	}
}