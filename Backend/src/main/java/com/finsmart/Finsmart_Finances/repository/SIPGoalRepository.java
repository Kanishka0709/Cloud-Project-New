package com.finsmart.Finsmart_Finances.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.finsmart.Finsmart_Finances.model.SIPGoal;

public interface SIPGoalRepository extends JpaRepository<SIPGoal, Long>{
	
	
	List<SIPGoal> findByUserId(Long UserId);
	
	@Query("Select s from SIPGoal s where s.nextScheduledInvestment <=:now")
	List<SIPGoal> findAllDueSIPs(@Param("now") LocalDate now);
}
