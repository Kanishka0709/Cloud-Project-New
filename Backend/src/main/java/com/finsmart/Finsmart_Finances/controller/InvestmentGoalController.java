package com.finsmart.Finsmart_Finances.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finsmart.Finsmart_Finances.dto.InvestmentGoalDTO;
import com.finsmart.Finsmart_Finances.model.InvestmentGoal;
import com.finsmart.Finsmart_Finances.model.SIPGoal;
import com.finsmart.Finsmart_Finances.model.User;
import com.finsmart.Finsmart_Finances.service.InvestmentGoalService;
import com.finsmart.Finsmart_Finances.service.InvestmentTransactionService;
import com.finsmart.Finsmart_Finances.service.SIPGoalService;

@RestController
@RequestMapping("/goals")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class InvestmentGoalController {

    private final InvestmentGoalService goalService;
    private final SIPGoalService sipGoalService;
    private final InvestmentTransactionService transactionService;
    private final ObjectMapper objectMapper;
    private static final Logger log = LoggerFactory.getLogger(InvestmentGoalController.class);

    public InvestmentGoalController(InvestmentGoalService goalService, SIPGoalService sipGoalService, 
                                   InvestmentTransactionService transactionService, ObjectMapper objectMapper) {
        this.goalService = goalService;
        this.sipGoalService = sipGoalService;
        this.transactionService = transactionService;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public ResponseEntity<InvestmentGoalDTO> createGoal(@RequestBody JsonNode requestBody, Authentication authen) {
        
    	// Check if authentication is present
    	if (authen == null) {
    		log.warn("Authentication object is null - user not authenticated");
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    	}
    	
    	String username = authen.getName();
    	User logged_in = goalService.findusingusername(username);
    	
    	if(logged_in == null) {
    		log.warn("Unauthorized attempt to add expense by user: {}", username);
 			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    	}
    	
    	if(requestBody == null) {
        	log.warn("Investment Goal Cannot Be NULL");
        	return ResponseEntity.badRequest().build();
        }
        
        try {
            // Check if this is a SIP goal
            boolean isSIP = requestBody.has("isSIP") && requestBody.get("isSIP").asBoolean();
            
            if (isSIP) {
                log.info("Creating SIP Goal: {}", requestBody.get("goalName").asText());
                
                // Create SIPGoal entity
                SIPGoal sipGoal = new SIPGoal();
                sipGoal.setGoalName(requestBody.get("goalName").asText());
                sipGoal.setTargetAmount(requestBody.get("targetAmount").asDouble());
                sipGoal.setStartDate(LocalDate.parse(requestBody.get("startDate").asText()));
                sipGoal.setEndDate(LocalDate.parse(requestBody.get("endDate").asText()));
                sipGoal.setStatus(requestBody.get("status").asText());
                sipGoal.setUser(logged_in);
                sipGoal.setIsSIP(true);
                sipGoal.setSipFrequency(requestBody.get("sipFrequency").asText());
                sipGoal.setSipamount(requestBody.get("sipAmount").asDouble());
                sipGoal.setNextScheduledInvestment(LocalDate.parse(requestBody.get("nextScheduledInvestment").asText()));
                
                // Save using SIPGoalService
                SIPGoal savedSIPGoal = sipGoalService.addSIP(sipGoal);
                
                // Convert to DTO and return
                InvestmentGoalDTO dto = new InvestmentGoalDTO();
                dto.setId(savedSIPGoal.getId());
                dto.setGoalName(savedSIPGoal.getGoalName());
                dto.setTargetAmount(savedSIPGoal.getTargetAmount());
                dto.setStartDate(savedSIPGoal.getStartDate());
                dto.setEndDate(savedSIPGoal.getEndDate());
                dto.setStatus(savedSIPGoal.getStatus());
                dto.setIsSIP(savedSIPGoal.getIsSIP());
                dto.setSipFrequency(savedSIPGoal.getSipFrequency());
                dto.setSipAmount(savedSIPGoal.getSipamount());
                dto.setNextScheduledInvestment(savedSIPGoal.getNextScheduledInvestment());
                
                log.info("SIP Goal: {} saved", dto.getGoalName());
                return ResponseEntity.ok(dto);
            } else {
                // Regular investment goal
                InvestmentGoal goal = objectMapper.treeToValue(requestBody, InvestmentGoal.class);
                goal.setUser(logged_in);
                InvestmentGoalDTO saved = goalService.createGoal(goal);
                log.info("Investment Goal: {} saved", saved.getGoalName());
                return ResponseEntity.ok(saved);
            }
        } catch (Exception e) {
            log.error("Error creating goal: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    
    @GetMapping
    public ResponseEntity<List<InvestmentGoalDTO>> getAllGoalsOfUser(Authentication authen) {
    	// Check if authentication is present
    	if (authen == null) {
    		log.warn("Authentication object is null - user not authenticated");
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    	}
    	
    	String username = authen.getName();
    	User logged_in = goalService.findusingusername(username);
    	
    	if(logged_in == null) {
    		log.warn("Unauthorized attempt to add expense by user: {}", username);
 			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    	}
    	
    	List<InvestmentGoalDTO> allGoalofUser = goalService.getAllGoalsrelatedtoUser(logged_in.getId());
    	
        return ResponseEntity.ok(allGoalofUser);
    }

    @GetMapping("/{id}")
    public Optional<InvestmentGoalDTO> getGoalById(@PathVariable Long id) {
        return goalService.getGoalById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGoal(@PathVariable Long id, Authentication authen) {
        // Check if authentication is present
        if (authen == null) {
            log.warn("Authentication object is null - user not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        
        try {
            // First delete all transactions associated with this goal
            transactionService.deleteTransactionsByGoalId(id);
            log.info("Deleted all transactions for goal ID: {}", id);
            
            // Then delete the goal
            goalService.deleteGoal(id);
            log.info("Investment goal deleted successfully. ID: {}", id);
            return ResponseEntity.ok("Investment goal and all associated transactions deleted successfully");
        } catch (Exception e) {
            log.error("Error deleting investment goal with ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to delete investment goal: " + e.getMessage());
        }
    }
    
    @GetMapping("/by-date/{date}")
	public ResponseEntity<List<InvestmentGoalDTO>> getBystartDate(Authentication authen, 
	     @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
    	String username = authen.getName();
    	User logged_in = goalService.findusingusername(username);
    	
    	if(logged_in == null) {
    		log.warn("Unauthorized attempt to add expense by user: {}", username);
 			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    	}
    	
    	List<InvestmentGoalDTO> allgoalofdate = goalService.getAllGoalOfStartDateAndUser(date, logged_in.getId());
    	
    	return ResponseEntity.ok(allgoalofdate);
    	
    	
    }
    
    @GetMapping("/by-start-month/{month}/{year}")
	public ResponseEntity<List<InvestmentGoalDTO>> getBystartMonth(Authentication authen, @PathVariable int month, @PathVariable int year) {
		String Username = authen.getName();
		log.info("Fetching expenses for month {}-{} and user: {}", month, year, Username);
		
		User logged_in =  goalService.findusingusername(Username);
		if(logged_in == null) {
			log.warn("Unauthorized access to month filter by user: {}", Username);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		List<InvestmentGoalDTO> allgoalofstartmonth = goalService.getAllGoalWhichStartedInMonthOfUser(month, year, logged_in.getId());
		
		return ResponseEntity.ok(allgoalofstartmonth);
    }	
    
    @GetMapping("/by-start-year/{year}")
	public ResponseEntity<List<InvestmentGoalDTO>> getBystartyear(Authentication authen, @PathVariable int year) {
		String Username = authen.getName();
		log.info("Fetching expenses for year {} and user: {}", year, Username);
		
		User logged_in =  goalService.findusingusername(Username);
		if(logged_in == null) {
			log.warn("Unauthorized access to year filter by user: {}", Username);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		List<InvestmentGoalDTO> allgoalofstartyear = goalService.getAllGoalWhichStartedInYearOfUser(year, logged_in.getId());
		
		return ResponseEntity.ok(allgoalofstartyear);
    }	
    
    
    @GetMapping("/by-end-date/{date}")
	public ResponseEntity<List<InvestmentGoalDTO>> getByendDate(Authentication authen, 
	     @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
    	String username = authen.getName();
    	User logged_in = goalService.findusingusername(username);
    	
    	if(logged_in == null) {
    		log.warn("Unauthorized attempt to add expense by user: {}", username);
 			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    	}
    	
    	List<InvestmentGoalDTO> allgoalofenddate = goalService.getAllGoalOfEndDateAndUser(date, logged_in.getId());
    	
    	return ResponseEntity.ok(allgoalofenddate);
    	    	
    }
    
    @GetMapping("/by-end-month/{month}/{year}")
	public ResponseEntity<List<InvestmentGoalDTO>> getByendMonth(Authentication authen, @PathVariable int month, @PathVariable int year) {
		String Username = authen.getName();
		log.info("Fetching expenses for month {}-{} and user: {}", month, year, Username);
		
		User logged_in =  goalService.findusingusername(Username);
		if(logged_in == null) {
			log.warn("Unauthorized access to month filter by user: {}", Username);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		List<InvestmentGoalDTO> allgoalofendmonth = goalService.getAllGoalWhichEndedInMonthOfUser(month, year, logged_in.getId());
		
		return ResponseEntity.ok(allgoalofendmonth);
    }	
    
    @GetMapping("/by-end-year/{year}")
	public ResponseEntity<List<InvestmentGoalDTO>> getByendyear(Authentication authen, @PathVariable int year) {
		String Username = authen.getName();
		log.info("Fetching expenses for year {} and user: {}", year, Username);
		
		User logged_in =  goalService.findusingusername(Username);
		if(logged_in == null) {
			log.warn("Unauthorized access to year filter by user: {}", Username);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		List<InvestmentGoalDTO> allgoalofendyear = goalService.getAllGoalWhichEndedInYearOfUser(year, logged_in.getId());
		
		return ResponseEntity.ok(allgoalofendyear);
    }	
    
    
}