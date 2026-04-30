package com.finsmart.Finsmart_Finances.controller;

import java.time.LocalDate;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.format.annotation.DateTimeFormat;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.finsmart.Finsmart_Finances.dto.ExpenseDTO;
import com.finsmart.Finsmart_Finances.model.Expense;
import com.finsmart.Finsmart_Finances.model.User;
import com.finsmart.Finsmart_Finances.service.ExpenseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/expenses")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ExpenseController {
	
	private static final Logger logger = LoggerFactory.getLogger(ExpenseController.class);
	private final ExpenseService expser;
	
	public ExpenseController(ExpenseService expenservice) {
		this.expser = expenservice;
	}
	
	@PostMapping
	public ResponseEntity<ExpenseDTO> addExpense(@Valid @RequestBody Expense ex,Authentication authen) {
		String username = authen.getName();
		logger.info("Received request to add expense for user: {}", username);

		User logged_in = expser.findusingusername(username);
		if(logged_in == null) {
			 logger.warn("Unauthorized attempt to add expense by user: {}", username);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		 ex.setUser(logged_in);
		    ExpenseDTO created = expser.createExpense(ex);
		    logger.info("Expense successfully created for user: {}", username);
		    return ResponseEntity.ok(created);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<ExpenseDTO> getExpbyidUser(@PathVariable Long id, Authentication authen){
		String Username = authen.getName();
		logger.info("Fetching expense ID {} for user: {}", id,Username);	
		
		User logged_in =  expser.findusingusername(Username);
		
		if(logged_in == null) {
			logger.warn("Unauthorized attempt to add expense by user: {}", Username);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		ExpenseDTO exp = expser.getByIdandUser(id, logged_in.getId());
		
		return ResponseEntity.ok(exp);
		
		
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<ExpenseDTO> updateExpense(
        @PathVariable Long id,
        @RequestBody ExpenseDTO expenseDto,
        Authentication authen) {
    String username = authen.getName();
    User logged_in = expser.findusingusername(username);
    if (logged_in == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    ExpenseDTO updated = expser.updateExpense(id, expenseDto, logged_in.getId());
    return ResponseEntity.ok(updated);
}
	
	@DeleteMapping("/{id}")
	public void del(@PathVariable Long id) {
		logger.info("Deleting expense ID: {}", id);
		expser.deleteexpense(id);
	}
	
	@GetMapping
	public ResponseEntity<List<ExpenseDTO>> getuserid(Authentication authen){
		String Username = authen.getName();
		logger.info("Fetching all expenses for user: {}", Username);
		
		User logged_in =  expser.findusingusername(Username);
		if(logged_in == null) {
			logger.warn("Unauthorized access attempt to get all expenses by user: {}", Username);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		return ResponseEntity.ok(expser.getbyUserid(logged_in.getId()));
		
	}
	
	@GetMapping("/by-date/{date}")
	public ResponseEntity<List<ExpenseDTO>> getByDate(Authentication authen, 
	     @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		String Username = authen.getName();
		logger.info("Fetching all expenses for user: {}", Username);
		
		User logged_in =  expser.findusingusername(Username);
		if(logged_in == null) {
			logger.warn("Unauthorized access attempt to get all expenses by user: {}", Username);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
	    return ResponseEntity.ok(expser.getByDateAndUser(date, logged_in.getId()));
	}

	@GetMapping("/by-month/{month}/{year}")
	public ResponseEntity<List<ExpenseDTO>> getByMonth(Authentication authen, @PathVariable int month, @PathVariable int year) {
		String Username = authen.getName();
		logger.info("Fetching expenses for month {}-{} and user: {}", month, year, Username);
		
		User logged_in =  expser.findusingusername(Username);
		if(logged_in == null) {
			logger.warn("Unauthorized access to month filter by user: {}", Username);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		
		return ResponseEntity.ok(expser.getByMonthAndUser(month, year, logged_in.getId()));
	}

	@GetMapping("/by-year/{year}")
	public ResponseEntity<List<ExpenseDTO>> getByYear(Authentication authen, @PathVariable int year) {
		String Username = authen.getName();
		logger.info("Fetching expenses for year {} and user: {}", year, Username);

		
		User logged_in =  expser.findusingusername(Username);
		if(logged_in == null) {
			logger.warn("Unauthorized access to year filter by user: {}", Username);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	    return ResponseEntity.ok(expser.getByYearAndUser(year, logged_in.getId()));
	}

    @GetMapping("/by-months")
    public ResponseEntity<List<ExpenseDTO>> getByMonths(
            Authentication authen,
            @RequestParam List<Integer> months,
            @RequestParam int year) {
        String Username = authen.getName();
        logger.info("Fetching expenses for months {} in year {} and user: {}", months, year, Username);
        User logged_in = expser.findusingusername(Username);
        if (logged_in == null) {
            logger.warn("Unauthorized access to multi-month filter by user: {}", Username);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(expser.getByMonthsAndUser(months, year, logged_in.getId()));
    }

    @GetMapping("/by-month-range")
    public ResponseEntity<List<ExpenseDTO>> getByMonthRange(
            Authentication authen,
            @RequestParam int start,
            @RequestParam int end,
            @RequestParam int year) {
        String Username = authen.getName();
        logger.info("Fetching expenses for months {}-{} in year {} and user: {}", start, end, year, Username);
        User logged_in = expser.findusingusername(Username);
        if (logged_in == null) {
            logger.warn("Unauthorized access to month range filter by user: {}", Username);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(expser.getByMonthRangeAndUser(start, end, year, logged_in.getId()));
    }


}
