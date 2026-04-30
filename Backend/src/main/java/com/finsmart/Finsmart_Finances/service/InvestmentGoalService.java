package com.finsmart.Finsmart_Finances.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.finsmart.Finsmart_Finances.dto.InvestmentGoalDTO;
import com.finsmart.Finsmart_Finances.model.InvestmentGoal;
import com.finsmart.Finsmart_Finances.model.User;

public interface InvestmentGoalService {
	
	InvestmentGoalDTO createGoal(InvestmentGoal goal);

    List<InvestmentGoalDTO> getAllGoalsrelatedtoUser(Long Userid);

    Optional<InvestmentGoalDTO> getGoalById(Long id);
    
    List<InvestmentGoalDTO> getAllGoalOfStartDateAndUser(LocalDate startDate,Long UserIds);
    
    List<InvestmentGoalDTO> getAllGoalWhichStartedInMonthOfUser(int month,int year,Long UserIds);
    
    List<InvestmentGoalDTO> getAllGoalWhichStartedInYearOfUser(int year,Long UserIds);
    
    
    List<InvestmentGoalDTO> getAllGoalOfEndDateAndUser(LocalDate endDate,Long UserIds);
    
    List<InvestmentGoalDTO> getAllGoalWhichEndedInMonthOfUser(int month,int year,Long UserIds);
    
    List<InvestmentGoalDTO> getAllGoalWhichEndedInYearOfUser(int year,Long UserIds);
    
    User findusingusername(String Username);

    void deleteGoal(Long id);
	

}