package com.finsmart.Finsmart_Finances.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.finsmart.Finsmart_Finances.exception.BusinessException;
import com.finsmart.Finsmart_Finances.exception.DataIntegrityViolationException;
import com.finsmart.Finsmart_Finances.exception.ResourceNotPresent;
import com.finsmart.Finsmart_Finances.exception.UserNotfoundException;
import com.finsmart.Finsmart_Finances.model.InvestmentTransaction;
import com.finsmart.Finsmart_Finances.model.SIPGoal;
import com.finsmart.Finsmart_Finances.model.User;
import com.finsmart.Finsmart_Finances.repository.InvestmentTransactionRepository;
import com.finsmart.Finsmart_Finances.repository.SIPGoalRepository;
import com.finsmart.Finsmart_Finances.repository.UserRepository;
import com.finsmart.Finsmart_Finances.service.SIPGoalService;

@Service
public class SIPGoalServiceImpl implements SIPGoalService{
	
	private static final Logger log = LoggerFactory.getLogger((SIPGoalServiceImpl.class));
	@Autowired
	private final SIPGoalRepository SIPrepo;
	@Autowired
	private final InvestmentTransactionRepository  invesRepo;
	
	@Autowired
	private final UserRepository userepo;
	

	

	public SIPGoalServiceImpl( SIPGoalRepository sIPrepo, InvestmentTransactionRepository invesRepo,
			UserRepository userepo) {
		super();
		
		SIPrepo = sIPrepo;
		this.invesRepo = invesRepo;
		this.userepo = userepo;
	}
	
	@Override
	public SIPGoal addSIP(SIPGoal sip) {
		if(sip == null) {
			log.warn("Invalid SIP");
		}
		
		try {
			SIPGoal saved = SIPrepo.save(sip); 
			
			return saved;
			
		}catch(DataIntegrityViolationException d) {
			throw new DataIntegrityViolationException("Failed to save the SIP Goal");
		}
	}
	
	
	@Override
	@Scheduled(cron = "*/10 * * * * *")
	public void simulateSIPInvestments() {
		try {
			log.info("Starting SIP simulation check at: {}", LocalDateTime.now());
			
			List<SIPGoal> dueGoal = SIPrepo.findAllDueSIPs(LocalDate.now());
			log.info("Found {} due SIP goals", dueGoal.size());
			
			for(SIPGoal sip: dueGoal) {
				try {
					log.info("Processing SIP for goal: {} (ID: {})", sip.getGoalName(), sip.getId());
					
					InvestmentTransaction fakeTxn = new InvestmentTransaction();
					fakeTxn.setAmount(sip.getSipamount());
					fakeTxn.setDateTime(LocalDateTime.now());
					fakeTxn.setMode("Auto-SIP");
					fakeTxn.setGoal(sip);
					fakeTxn.setNote("Automated SIP installment");
					
					InvestmentTransaction savedTxn = invesRepo.save(fakeTxn);
					log.info("Created transaction ID: {} for amount: {}", savedTxn.getId(), savedTxn.getAmount());
					
					// Special handling for daily SIP goals - keep them due for the same day
					if ("daily".equalsIgnoreCase(sip.getSipFrequency())) {
						// For daily SIP, keep the next scheduled investment as today
						// This allows multiple transactions within the same day for testing
						sip.setNextScheduledInvestment(LocalDate.now());
						log.info("Daily SIP goal - keeping next scheduled investment as today for continuous testing");
					} else {
						// For weekly/monthly, update to next scheduled date
						LocalDate nextDate = getNextDate(sip);
						sip.setNextScheduledInvestment(nextDate);
						log.info("Updated next scheduled investment to: {} for goal: {}", nextDate, sip.getGoalName());
					}
					
					SIPGoal updatedSip = SIPrepo.save(sip);
					
				} catch (Exception e) {
					log.error("Error processing SIP for goal ID {}: {}", sip.getId(), e.getMessage(), e);
				}
			}
			
			log.info("SIP simulation check completed");
			
		} catch (Exception e) {
			log.error("Error in SIP simulation: {}", e.getMessage(), e);
		}
	}

	@Override
	public LocalDate getNextDate(SIPGoal sipGoal) {
		switch (sipGoal.getSipFrequency().toLowerCase()) {
	        case "weekly": return sipGoal.getNextScheduledInvestment().plusWeeks(1);
	        case "monthly": return sipGoal.getNextScheduledInvestment().plusMonths(1);
	        case "daily": return sipGoal.getNextScheduledInvestment().plusDays(1);
	        default: return sipGoal.getNextScheduledInvestment().plusMonths(1);
		}
	}

	@Override
	public User findBytheUsername(String username) {
		if(username == null) {
			log.warn("Null Username Received");
			throw new IllegalArgumentException("Username cannot be null");
		}
		
		if(!userepo.existsByUsername(username)) {
			log.warn("No User found with Username: {}",username);
			throw new ResourceNotPresent("User", username);
		}
		
		try {
			log.info("Fetching the User");
			User u = userepo.findByUsername(username);
			
			return u;
		}
		catch(Exception e) {
			throw new BusinessException("Failed to retrieve user: " + e.getMessage());

		}
	}

	@Override
	public List<SIPGoal> getByUserId(Long id) {
		if(id == null) {
			log.warn("UserId cannot be null");
			throw new IllegalArgumentException("UserId cannot be null");
		}
		
		if(!userepo.existsById(id)) {
			throw new UserNotfoundException(id);
		}
		
		try {
			List<SIPGoal> related = SIPrepo.findByUserId(id);
			return related;
		}catch(Exception e) {
			throw new BusinessException("Cannot Retrieve the users related to this User Id");
		}
	}



	

}



