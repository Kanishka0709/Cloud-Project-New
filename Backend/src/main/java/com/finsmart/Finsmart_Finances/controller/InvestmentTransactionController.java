package com.finsmart.Finsmart_Finances.controller;

import java.util.List;
import java.util.Optional;

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

import com.finsmart.Finsmart_Finances.dto.InvestmentTransactionDTO;
import com.finsmart.Finsmart_Finances.dto.InvestmentTransactionRequest;
import com.finsmart.Finsmart_Finances.model.User;
import com.finsmart.Finsmart_Finances.service.InvestmentTransactionService;
import com.finsmart.Finsmart_Finances.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class InvestmentTransactionController {

    private static final Logger logger = LoggerFactory.getLogger(InvestmentTransactionController.class);
    private final InvestmentTransactionService service;
    private final UserService userService;

    public InvestmentTransactionController(InvestmentTransactionService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<InvestmentTransactionDTO> create(@Valid @RequestBody InvestmentTransactionRequest txReq, Authentication authen) {
        System.out.println("=== TRANSACTION CONTROLLER CALLED ===");
        
        // Check if authentication is present
        if (authen == null) {
            System.out.println("ERROR: Authentication object is null");
            logger.warn("Authentication object is null - user not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        
        String username = authen.getName();
        System.out.println("Username: " + username);
        
        User logged_in = userService.findUserByUsername(username);
        
        if (logged_in == null) {
            System.out.println("ERROR: User not found: " + username);
            logger.warn("Unauthorized attempt to add transaction by user: {}", username);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        System.out.println("User found: " + logged_in.getUsername());
        System.out.println("Transaction request: " + txReq);
        System.out.println("Goal ID: " + txReq.getGoalId());
        
        logger.info("Creating transaction for user: {}", username);
        logger.info("Received transaction request: {}", txReq);
        logger.info("goalId: {}", txReq.getGoalId());
        
        try {
            System.out.println("Calling service.createTransaction...");
            InvestmentTransactionDTO result = service.createTransaction(txReq);
            System.out.println("Service returned: " + result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("ERROR in controller: " + e.getMessage());
            e.printStackTrace();
            logger.error("Error creating transaction: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<InvestmentTransactionDTO>> getAll(Authentication authen) {
        // Check if authentication is present
        if (authen == null) {
            logger.warn("Authentication object is null - user not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        
        String username = authen.getName();
        User logged_in = userService.findUserByUsername(username);
        
        if (logged_in == null) {
            logger.warn("Unauthorized attempt to get transactions by user: {}", username);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        logger.info("Getting transactions for user: {}", username);
        
        try {
            List<InvestmentTransactionDTO> transactions = service.getAllTransactionsByUser(logged_in.getId());
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            logger.error("Error getting transactions: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public Optional<InvestmentTransactionDTO> getById(@PathVariable Long id) {
        return service.getTransactionById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvestmentTransactionDTO> updateTransaction(@PathVariable Long id, @RequestBody InvestmentTransactionDTO updatedTx) {
        InvestmentTransactionDTO updated = service.updateTransaction(id, updatedTx);
        return ResponseEntity.ok(updated);
    }

   
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteTransaction(id);
    }
}
