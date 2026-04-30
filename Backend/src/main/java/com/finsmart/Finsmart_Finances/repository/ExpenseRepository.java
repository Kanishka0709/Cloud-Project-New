package com.finsmart.Finsmart_Finances.repository;

import java.time.LocalDate;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.finsmart.Finsmart_Finances.model.Expense;
import com.finsmart.Finsmart_Finances.model.User;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
	
	Expense findByIdAndUserId(Long id, Long userId);
	
	List<Expense> findByUserId(Long userId);


    // ✅ Correct usage of nested property e.user.id
    List<Expense> findByExpenseDateAndUserId(LocalDate expenseDate, Long userId);

    @Query("SELECT e FROM Expense e WHERE MONTH(e.expenseDate) = :month AND YEAR(e.expenseDate) = :year AND e.user.id = :userId")
    List<Expense> findByMonthAndUserId(@Param("month") int month, @Param("year") int year, @Param("userId") Long userId);

    @Query("SELECT e FROM Expense e WHERE YEAR(e.expenseDate) = :year AND e.user.id = :userId")
    List<Expense> findByYearAndUserId(@Param("year") int year, @Param("userId") Long userId);
}


