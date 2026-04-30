package com.finsmart.Finsmart_Finances.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.finsmart.Finsmart_Finances.model.InvestmentGoal;

public interface InvestmentGoalRepository extends JpaRepository<InvestmentGoal, Long> {
    
    List<InvestmentGoal> findByUserId(Long userId);
    
    List<InvestmentGoal> findByStartDateAndUserId(LocalDate startDate, Long userId);

    @Query("SELECT i FROM InvestmentGoal i WHERE MONTH(i.startDate) = :month AND YEAR(i.startDate) = :year AND i.user.id = :userId")
    List<InvestmentGoal> findByMonthAndUserId(@Param("month") int month, @Param("year") int year, @Param("userId") Long userId);

    @Query("SELECT i FROM InvestmentGoal i WHERE YEAR(i.startDate) = :year AND i.user.id = :userId")
    List<InvestmentGoal> findByYearAndUserId(@Param("year") int year, @Param("userId") Long userId);

    List<InvestmentGoal> findByEndDateAndUserId(LocalDate endDate, Long userId);

    @Query("SELECT i FROM InvestmentGoal i WHERE MONTH(i.endDate) = :month AND YEAR(i.endDate) = :year AND i.user.id = :userId")
    List<InvestmentGoal> findByEndMonthAndUserId(@Param("month") int month, @Param("year") int year, @Param("userId") Long userId);

    @Query("SELECT i FROM InvestmentGoal i WHERE YEAR(i.endDate) = :year AND i.user.id = :userId")
    List<InvestmentGoal> findByEndYearAndUserId(@Param("year") int year, @Param("userId") Long userId);
}
