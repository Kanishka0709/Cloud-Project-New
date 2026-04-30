package com.finsmart.Finsmart_Finances.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.finsmart.Finsmart_Finances.dto.IncomeDTO;
import com.finsmart.Finsmart_Finances.service.IncomeService;

@RestController
@RequestMapping("/incomes")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class IncomeController {
    private static final Logger logger = LoggerFactory.getLogger(IncomeController.class);
    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @GetMapping
    public ResponseEntity<IncomeDTO> getIncome(Authentication authen) {
        if (authen == null || authen.getName() == null) {
            logger.warn("Attempt to get income without authentication.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Long userId = incomeService.findUserByUsername(authen.getName()).getId();
        IncomeDTO income = incomeService.getIncomeByUser(userId);
        return ResponseEntity.ok(income);
    }

    @PostMapping
    public ResponseEntity<IncomeDTO> setOrUpdateIncome(@RequestParam double amount, Authentication authen) {
        if (authen == null || authen.getName() == null) {
            logger.warn("Attempt to set income without authentication.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Long userId = incomeService.findUserByUsername(authen.getName()).getId();
        IncomeDTO income = incomeService.setOrUpdateIncome(userId, amount);
        return ResponseEntity.ok(income);
    }
} 