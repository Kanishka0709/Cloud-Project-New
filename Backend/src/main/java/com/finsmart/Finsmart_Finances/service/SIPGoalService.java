package com.finsmart.Finsmart_Finances.service;

import java.time.LocalDate;
import java.util.List;

import com.finsmart.Finsmart_Finances.model.SIPGoal;
import com.finsmart.Finsmart_Finances.model.User;

public interface SIPGoalService {
	
	public List<SIPGoal> getByUserId(Long id);
	public SIPGoal addSIP(SIPGoal sip);
	public void simulateSIPInvestments();
	public LocalDate getNextDate(SIPGoal sipGoal);
	public User findBytheUsername(String username);
	

}
