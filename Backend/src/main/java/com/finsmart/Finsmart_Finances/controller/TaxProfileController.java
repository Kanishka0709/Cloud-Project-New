package com.finsmart.Finsmart_Finances.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finsmart.Finsmart_Finances.dto.TaxProfileDTO;
import com.finsmart.Finsmart_Finances.model.TaxProfile;
import com.finsmart.Finsmart_Finances.model.User;
import com.finsmart.Finsmart_Finances.service.TaxProfileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/taxprofiles")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TaxProfileController {
	
	private static final Logger log = LoggerFactory.getLogger(TaxProfileController.class); 
    private final TaxProfileService taxService;

    public TaxProfileController(TaxProfileService taxService) {
        this.taxService = taxService;
    }

    @PostMapping
    public ResponseEntity<TaxProfileDTO> save(@Valid @RequestBody TaxProfile taxProfile, Authentication authen) {
    	System.out.println("=== TAX PROFILE CONTROLLER POST CALLED ===");
    	
    	if (authen == null) {
    		System.out.println("ERROR: Authentication object is null");
    		log.warn("Authentication object is null - user not authenticated");
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    	}
    	
    	String username = authen.getName();
    	System.out.println("Username: " + username);
    	
    	User logged_in = taxService.findbyusername(username);     	
    	
    	if(logged_in == null) {
    		System.out.println("ERROR: User not found: " + username);
    		log.warn("Unauthorized Attempt to add taxProfile");
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    	}
    	
    	if(taxProfile == null) {
    		System.out.println("ERROR: Tax profile is null");
    		log.warn("Please Send valid TaxProfile");
    		return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    	}
    	
    	System.out.println("User found: " + logged_in.getUsername());
    	taxProfile.setUser(logged_in);
    	
    	try {
    		System.out.println("Calling taxService.saveTaxProfile...");
    		TaxProfileDTO result = taxService.saveTaxProfile(taxProfile);
    		System.out.println("Service returned: " + result);
    		return ResponseEntity.ok(result);
    	} catch (Exception e) {
    		System.err.println("ERROR in controller: " + e.getMessage());
    		e.printStackTrace();
    		log.error("Error saving tax profile: {}", e.getMessage());
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    	}
    }

    @GetMapping()
    public ResponseEntity<List<TaxProfileDTO>> getByUserId(Authentication authen) {
    	System.out.println("=== TAX PROFILE CONTROLLER GET CALLED ===");
    	
    	if (authen == null) {
    		System.out.println("ERROR: Authentication object is null");
    		log.warn("Authentication object is null - user not authenticated");
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    	}
    	
    	String username = authen.getName();
    	System.out.println("Username: " + username);
    	
    	User logged_in = taxService.findbyusername(username);     	
    	
    	if(logged_in == null) {
    		System.out.println("ERROR: User not found: " + username);
    		log.warn("Unauthorized Attempt to get taxProfile");
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    	}
    	
    	System.out.println("User found: " + logged_in.getUsername() + ", ID: " + logged_in.getId());
    	
    	try {
    		System.out.println("Calling taxService.getByUserId...");
    		List<TaxProfileDTO> taxprofiles = taxService.getByUserId(logged_in.getId());
    		System.out.println("Service returned: " + taxprofiles.size() + " profiles");
    		if(taxprofiles != null && !taxprofiles.isEmpty()) {
    			log.info("found {} tax profiles", taxprofiles.size());
    		}
    		return ResponseEntity.ok(taxprofiles);
    	} catch (Exception e) {
    		System.err.println("ERROR in controller: " + e.getMessage());
    		e.printStackTrace();
    		log.error("Error getting tax profiles: {}", e.getMessage());
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    	}
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaxProfileDTO> update(@PathVariable Long id, @Valid @RequestBody TaxProfile taxProfile, Authentication authen) {
    	System.out.println("=== TAX PROFILE CONTROLLER PUT CALLED ===");
    	System.out.println("Updating tax profile with ID: " + id);
    	
    	if (authen == null) {
    		System.out.println("ERROR: Authentication object is null");
    		log.warn("Authentication object is null - user not authenticated");
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    	}
    	
    	String username = authen.getName();
    	System.out.println("Username: " + username);
    	
    	User logged_in = taxService.findbyusername(username);     	
    	
    	if(logged_in == null) {
    		System.out.println("ERROR: User not found: " + username);
    		log.warn("Unauthorized Attempt to update taxProfile");
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    	}
    	
    	if(taxProfile == null) {
    		System.out.println("ERROR: Tax profile is null");
    		log.warn("Please Send valid TaxProfile");
    		return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    	}
    	
    	System.out.println("User found: " + logged_in.getUsername());
    	taxProfile.setId(id);
    	taxProfile.setUser(logged_in);
    	
    	try {
    		System.out.println("Calling taxService.saveTaxProfile for update...");
    		TaxProfileDTO result = taxService.saveTaxProfile(taxProfile);
    		System.out.println("Service returned: " + result);
    		return ResponseEntity.ok(result);
    	} catch (Exception e) {
    		System.err.println("ERROR in controller: " + e.getMessage());
    		e.printStackTrace();
    		log.error("Error updating tax profile: {}", e.getMessage());
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    	}
    }

    @DeleteMapping
    public ResponseEntity<Void> delete(Authentication authen) {
    	System.out.println("=== TAX PROFILE CONTROLLER DELETE CALLED ===");
    	
    	if (authen == null) {
    		System.out.println("ERROR: Authentication object is null");
    		log.warn("Authentication object is null - user not authenticated");
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    	}
    	
    	String username = authen.getName();
    	System.out.println("Username: " + username);
    	
    	User logged_in = taxService.findbyusername(username);     	
    	
    	if(logged_in == null) {
    		System.out.println("ERROR: User not found: " + username);
    		log.warn("Unauthorized Attempt to delete taxProfile");
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    	}
    	
    	try {
    		System.out.println("Calling taxService.deleteTaxProfileOfUser...");
    		taxService.deleteTaxProfileOfUser(logged_in.getId());
    		System.out.println("Tax profile deleted successfully");
    		return ResponseEntity.ok().build();
    	} catch (Exception e) {
    		System.err.println("ERROR in controller: " + e.getMessage());
    		e.printStackTrace();
    		log.error("Error deleting tax profile: {}", e.getMessage());
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    	}
    }
}
