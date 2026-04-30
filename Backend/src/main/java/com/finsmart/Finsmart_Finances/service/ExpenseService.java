package com.finsmart.Finsmart_Finances.service;

import java.time.LocalDate;
import java.util.List;

import com.finsmart.Finsmart_Finances.dto.ExpenseDTO;
import com.finsmart.Finsmart_Finances.model.Expense;
import com.finsmart.Finsmart_Finances.model.User;

public interface ExpenseService {
	
	ExpenseDTO createExpense(Expense e);
	
	ExpenseDTO getByIdandUser(Long id,Long user_id);
	List<ExpenseDTO> getByDateAndUser(LocalDate date, Long userId);
	List<ExpenseDTO> getByMonthAndUser(int month, int year, Long userId);
	List<ExpenseDTO> getByYearAndUser(int year, Long userId); 
	void deleteexpense(Long id);
	List<ExpenseDTO> getbyUserid(Long userId);
	List<ExpenseDTO> getByMonthsAndUser(List<Integer> months, int year, Long userId);
	List<ExpenseDTO> getByMonthRangeAndUser(int start, int end, int year, Long userId);
	
	User findusingusername(String username);
	ExpenseDTO updateExpense(Long id, ExpenseDTO expenseDto, Long userId);

}
