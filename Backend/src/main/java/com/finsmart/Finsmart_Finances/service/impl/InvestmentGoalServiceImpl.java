package com.finsmart.Finsmart_Finances.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.finsmart.Finsmart_Finances.dto.InvestmentGoalDTO;
import com.finsmart.Finsmart_Finances.exception.BusinessException;
import com.finsmart.Finsmart_Finances.exception.DataIntegrityViolationException;
import com.finsmart.Finsmart_Finances.exception.ResourceNotFoundException;
import com.finsmart.Finsmart_Finances.exception.ResourceNotPresent;
import com.finsmart.Finsmart_Finances.exception.UserNotfoundException;
import com.finsmart.Finsmart_Finances.model.InvestmentGoal;
import com.finsmart.Finsmart_Finances.model.User;
import com.finsmart.Finsmart_Finances.repository.InvestmentGoalRepository;
import com.finsmart.Finsmart_Finances.repository.UserRepository;
import com.finsmart.Finsmart_Finances.service.InvestmentGoalService;

@Service
public class InvestmentGoalServiceImpl implements InvestmentGoalService {
	
	
	private final InvestmentGoalRepository insergoal;
	private final ModelMapper MM;
	
	private final UserRepository usrepo;
	
	 private static final Logger logger = LoggerFactory.getLogger(InvestmentGoalServiceImpl.class);
	
	
	@Autowired
	public InvestmentGoalServiceImpl(InvestmentGoalRepository ine, ModelMapper mm, UserRepository u) {
		this.insergoal  = ine;
		this.MM = mm;
		this.usrepo = u;
		
	}
	
	public InvestmentGoalDTO converttoDTO(InvestmentGoal goal) {
		return MM.map(goal, InvestmentGoalDTO.class);
	}
	
	public InvestmentGoal converttoEntity(InvestmentGoalDTO goalD) {
		return MM.map(goalD, InvestmentGoal.class);
	}
	
	@Override
	public InvestmentGoalDTO createGoal(InvestmentGoal goal) {
		
		if(goal == null) {
			logger.warn("Invalid Goal");
			throw new IllegalArgumentException("Investment Goal Cannot be Null");
			
		}
		
		try {
			InvestmentGoalDTO saved = converttoDTO(insergoal.save(goal));
			logger.info("Added the Investment Goal: {}", saved.getGoalName());
			return saved;
			
		}catch (DataIntegrityViolationException ee) {
            throw new DataIntegrityViolationException("Failed to Add Investment Goal" + ee.getMessage());
        }
		
	}



	@Override
	public Optional<InvestmentGoalDTO> getGoalById(Long id) {
		InvestmentGoal goal = insergoal.findById(id).orElseThrow();		
		return Optional.ofNullable(converttoDTO(goal));
	}

	@Override
	public void deleteGoal(Long id) {
		if(id < 0 || id == null) {
			logger.warn("Invalid Id");
			throw new IllegalArgumentException("Invalid Expense Id");
		}
		
		if(!insergoal.existsById(id)) {
			logger.warn("No Investment Goal Found with This Id");
			throw new ResourceNotFoundException("No Investment Found with ID: "+ id, id);
		}
		
		try {
            insergoal.deleteById(id);
            logger.info("Expense deleted successfully. ID: {}", id);
        } catch (Exception e) {
            throw new BusinessException("Failed to delete Investment: " + e.getMessage());
        }
		
	}

	@Override
	public List<InvestmentGoalDTO> getAllGoalsrelatedtoUser(Long Userid) {
		if(Userid < 0  || Userid == null) {
			logger.warn("Invalid User ID");
			throw new IllegalArgumentException("Invalid User ID");
		}
		
		if(!usrepo.existsById(Userid)) {
			logger.warn("No User found with ID: {}", Userid);
			throw new UserNotfoundException(Userid);
		}
		
		try {
			List<InvestmentGoalDTO> allgoalsOfUser = insergoal.findByUserId(Userid).stream().map(this::converttoDTO).collect(Collectors.toList());
			if(allgoalsOfUser.isEmpty()) {
				logger.warn("No Investments Found Related to this User");
			}
			else {
				logger.info("Found Investments");
			}
			return allgoalsOfUser;
		}
		catch (Exception e) {
            throw new BusinessException("Can't find the Investments Related to This User : " + e.getMessage());
        }
		
		
	}

	@Override
	public List<InvestmentGoalDTO> getAllGoalOfStartDateAndUser(LocalDate startDate, Long Userid) {
		if(startDate == null) {
			logger.warn("Invalid Date");
		}
		if(Userid < 0  || Userid == null) {
			logger.warn("Invalid User ID");
			throw new IllegalArgumentException("Invalid User ID");
		}
		
		if(!usrepo.existsById(Userid)) {
			logger.warn("No User found with ID: {}", Userid);
			throw new UserNotfoundException(Userid);
		}
		try {
			List<InvestmentGoalDTO> allgoalsOfstartDateOfUser = insergoal.findByStartDateAndUserId(startDate,Userid).stream().map(this::converttoDTO).collect(Collectors.toList());
			if(allgoalsOfstartDateOfUser.isEmpty()) {
				logger.warn("No Investments Found Related to this User");
			}
			else {
				logger.info("Found Investments");
			}
			return allgoalsOfstartDateOfUser;
		}
		catch (Exception e) {
            throw new BusinessException("Can't find the Investments of the given Date which are Related to This User : " + e.getMessage());
        }
		
	}

	@Override
	public List<InvestmentGoalDTO> getAllGoalWhichStartedInMonthOfUser(int month, int year,Long Userid) {
		
		if(month < 0 ) {
			logger.warn("Invalid Month");
			throw new IllegalArgumentException("Invalid Month");
		}
		
		
		if(year< 0 ) {
			logger.warn("Invalid Year");
			throw new IllegalArgumentException("Invalid Year");
		}		
		
		
		
		if(Userid < 0  || Userid == null) {
			logger.warn("Invalid User ID");
			throw new IllegalArgumentException("Invalid User ID");
		}
		
		if(!usrepo.existsById(Userid)) {
			logger.warn("No User found with ID: {}", Userid);
			throw new UserNotfoundException(Userid);
		}
		try {
			List<InvestmentGoalDTO> allgoalsOfstartDatesMonthOfUser = insergoal.findByMonthAndUserId(month,year,Userid).stream().map(this::converttoDTO).collect(Collectors.toList());
			if(allgoalsOfstartDatesMonthOfUser.isEmpty()) {
				logger.warn("No Investments Found Related to this User");
			}
			else {
				logger.info("Found Investments");
			}
			return allgoalsOfstartDatesMonthOfUser;
		}
		catch (Exception e) {
            throw new BusinessException("Can't find the Investments of the given Month which are Related to This User : " + e.getMessage());
        }
	}

	@Override
	public List<InvestmentGoalDTO> getAllGoalWhichStartedInYearOfUser(int year, Long Userid) {
		if(year< 0 ) {
			logger.warn("Invalid Year");
			throw new IllegalArgumentException("Invalid Year");
		}		
		
		
		
		if(Userid < 0  || Userid == null) {
			logger.warn("Invalid User ID");
			throw new IllegalArgumentException("Invalid User ID");
		}
		
		if(!usrepo.existsById(Userid)) {
			logger.warn("No User found with ID: {}", Userid);
			throw new UserNotfoundException(Userid);
		}
		try {
			List<InvestmentGoalDTO> allgoalsOfstartDatesYearOfUser = insergoal.findByYearAndUserId(year,Userid).stream().map(this::converttoDTO).collect(Collectors.toList());
			if(allgoalsOfstartDatesYearOfUser.isEmpty()) {
				logger.warn("No Investments Found Related to this User");
			}
			else {
				logger.info("Found Investments");
			}
			return allgoalsOfstartDatesYearOfUser;
		}
		catch (Exception e) {
            throw new BusinessException("Can't find the Investments of the given Year which are Related to This User : " + e.getMessage());
        }
	}
	

	@Override
	public List<InvestmentGoalDTO> getAllGoalOfEndDateAndUser(LocalDate endDate, Long Userid) {
		if(endDate == null) {
			logger.warn("Invalid Date");
		}
		if(Userid < 0  || Userid == null) {
			logger.warn("Invalid User ID");
			throw new IllegalArgumentException("Invalid User ID");
		}
		
		if(!usrepo.existsById(Userid)) {
			logger.warn("No User found with ID: {}", Userid);
			throw new UserNotfoundException(Userid);
		}
		try {
			List<InvestmentGoalDTO> allgoalsOfendDateOfUser = insergoal.findByEndDateAndUserId(endDate,Userid).stream().map(this::converttoDTO).collect(Collectors.toList());
			if(allgoalsOfendDateOfUser.isEmpty()) {
				logger.warn("No Investments Found Related to this User");
			}
			else {
				logger.info("Found Investments");
			}
			return allgoalsOfendDateOfUser;
		}
		catch (Exception e) {
            throw new BusinessException("Can't find the Investments of the given Date which are Related to This User : " + e.getMessage());
        }
		
	}

	@Override
	public List<InvestmentGoalDTO> getAllGoalWhichEndedInMonthOfUser(int month,int year, Long Userid) {
		if(month < 0 ) {
			logger.warn("Invalid Month");
			throw new IllegalArgumentException("Invalid Month");
		}
		
		
		if(year< 0 ) {
			logger.warn("Invalid Year");
			throw new IllegalArgumentException("Invalid Year");
		}		
		
		
		
		if(Userid < 0  || Userid == null) {
			logger.warn("Invalid User ID");
			throw new IllegalArgumentException("Invalid User ID");
		}
		
		if(!usrepo.existsById(Userid)) {
			logger.warn("No User found with ID: {}", Userid);
			throw new UserNotfoundException(Userid);
		}
		try {
			List<InvestmentGoalDTO> allgoalsOfendDatesMonthOfUser = insergoal.findByEndMonthAndUserId(month,year,Userid).stream().map(this::converttoDTO).collect(Collectors.toList());
			if(allgoalsOfendDatesMonthOfUser.isEmpty()) {
				logger.warn("No Investments Found Related to this User");
			}
			else {
				logger.info("Found Investments");
			}
			return allgoalsOfendDatesMonthOfUser;
		}
		catch (Exception e) {
            throw new BusinessException("Can't find the Investments of the given Month which are Related to This User : " + e.getMessage());
        }
	}
	
	

	@Override
	public List<InvestmentGoalDTO> getAllGoalWhichEndedInYearOfUser(int year, Long Userid) {
		if(year< 0 ) {
			logger.warn("Invalid Year");
			throw new IllegalArgumentException("Invalid Year");
		}		
		
		
		
		if(Userid < 0  || Userid == null) {
			logger.warn("Invalid User ID");
			throw new IllegalArgumentException("Invalid User ID");
		}
		
		if(!usrepo.existsById(Userid)) {
			logger.warn("No User found with ID: {}", Userid);
			throw new UserNotfoundException(Userid);
		}
		try {
			List<InvestmentGoalDTO> allgoalsOfendDatesYearOfUser = insergoal.findByEndYearAndUserId(year,Userid).stream().map(this::converttoDTO).collect(Collectors.toList());
			if(allgoalsOfendDatesYearOfUser.isEmpty()) {
				logger.warn("No Investments Found Related to this User");
			}
			else {
				logger.info("Found Investments");
			}
			return allgoalsOfendDatesYearOfUser;
		}
		catch (Exception e) {
            throw new BusinessException("Can't find the Investments of the given Year which are Related to This User : " + e.getMessage());
        }
	}
	
	 @Override
	    public User findusingusername(String Username) {
	        if (Username == null) {
	            logger.warn("Username is null.");
	            throw new IllegalArgumentException("Invalid Username");
	        }

	        if (!usrepo.existsByUsername(Username)) {
	            logger.warn("No user found with username: {}", Username);
	            throw new ResourceNotPresent("User", Username);
	        }

	        try {
	            User u = usrepo.findByUsername(Username);
	            if (u == null) {
	                logger.warn("User object returned null for username: {}", Username);
	            } else {
	                logger.info("User found with username: {}", Username);
	            }
	            return u;
	        } catch (Exception e) {
	            throw new BusinessException("Error fetching user: " + e.getMessage());
	        }
	    }

	
}