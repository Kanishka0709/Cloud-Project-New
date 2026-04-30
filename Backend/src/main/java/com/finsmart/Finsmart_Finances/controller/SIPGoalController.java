package com.finsmart.Finsmart_Finances.controller;

import java.util.List;


import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finsmart.Finsmart_Finances.dto.InvestmentGoalDTO;
import com.finsmart.Finsmart_Finances.model.InvestmentGoal;
import com.finsmart.Finsmart_Finances.model.SIPGoal;
import com.finsmart.Finsmart_Finances.model.User;
import com.finsmart.Finsmart_Finances.service.InvestmentGoalService;
import com.finsmart.Finsmart_Finances.service.SIPGoalService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/SIPGoals")
@CrossOrigin
public class SIPGoalController {

    private static final Logger log = LoggerFactory.getLogger(SIPGoalController.class);

    private final ModelMapper MM;

    @Autowired
    private final SIPGoalService sipserv;

    public SIPGoalController(SIPGoalService sipserv, ModelMapper mm) {
        this.sipserv = sipserv;
        this.MM = mm;
    }

    @PostMapping
    public ResponseEntity<SIPGoal> addSIP(@Valid @RequestBody SIPGoal goal, Authentication authen) {
        String username = authen.getName();
        User logged_in = sipserv.findBytheUsername(username);

        if (logged_in == null) {
            log.warn("Unauthorized attempt to add SIPGoal by user: {}", username);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.info("Saving SIPGoal directly...");

        goal.setUser(logged_in); // associate SIPGoal with the user
        SIPGoal finalSIP = sipserv.addSIP(goal);

        if (finalSIP == null) {
            log.warn("Failed to save SIPGoal");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.ok(finalSIP);
    }

    @GetMapping
    public ResponseEntity<List<SIPGoal>> getSIPGoalsForUser(Authentication authen) {
        String username = authen.getName();
        User logged_in = sipserv.findBytheUsername(username);

        if (logged_in == null) {
            log.warn("Unauthorized access attempt by user: {}", username);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<SIPGoal> goals = sipserv.getByUserId(logged_in.getId());
        return ResponseEntity.ok(goals);
    }
}

	
	

