package com.finsmart.Finsmart_Finances.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.finsmart.Finsmart_Finances.dto.ExpenseDTO;
import com.finsmart.Finsmart_Finances.exception.BusinessException;
import com.finsmart.Finsmart_Finances.exception.DataIntegrityViolationException;
import com.finsmart.Finsmart_Finances.exception.ResourceNotFoundException;
import com.finsmart.Finsmart_Finances.exception.ResourceNotPresent;
import com.finsmart.Finsmart_Finances.exception.UserNotfoundException;
import com.finsmart.Finsmart_Finances.model.Expense;
import com.finsmart.Finsmart_Finances.model.User;
import com.finsmart.Finsmart_Finances.repository.ExpenseRepository;
import com.finsmart.Finsmart_Finances.repository.UserRepository;
import com.finsmart.Finsmart_Finances.service.ExpenseService;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expRepo;
    private final UserRepository usrepo;
    private final ModelMapper MM;

    private static final Logger logger = LoggerFactory.getLogger(ExpenseServiceImpl.class);

    public ExpenseServiceImpl(ExpenseRepository ex, ModelMapper mm, UserRepository usrepo) {
        this.expRepo = ex;
        this.MM = mm;
        this.usrepo = usrepo;
    }

    public ExpenseDTO converttoDTO(Expense e) {
        return MM.map(e, ExpenseDTO.class);
    }

    public Expense converttoEntity(ExpenseDTO exd) {
        return MM.map(exd, Expense.class);
    }

    @Override
    public ExpenseDTO createExpense(Expense e) {
        if (e == null) {
            logger.warn("Null Expense object received for creation.");
            throw new IllegalArgumentException("Expense cannot be null");
        }
        try {
            ExpenseDTO ee = converttoDTO(expRepo.save(e));
            logger.info("Expense saved to database: {}", ee);
            return ee;
        } catch (DataIntegrityViolationException ee) {
            throw new DataIntegrityViolationException("Failed to create expense: " + ee.getMessage());
        }
    }

    @Override
    public void deleteexpense(Long id) {
        if (id == null || id <= 0) {
            logger.warn("Invalid Expense ID: {}", id);
            throw new IllegalArgumentException("Invalid expense ID");
        }

        if (!expRepo.existsById(id)) {
            logger.warn("No Expense found with ID: {}", id);
            throw new ResourceNotFoundException("Expense not found with ID: " + id, id);
        }

        try {
            expRepo.deleteById(id);
            logger.info("Expense deleted successfully. ID: {}", id);
        } catch (Exception e) {
            throw new BusinessException("Failed to delete expense: " + e.getMessage());
        }
    }

    @Override
    public List<ExpenseDTO> getByDateAndUser(LocalDate date, Long userId) {
        if (date == null) {
            logger.warn("Date cannot be null.");
            throw new IllegalArgumentException("Date cannot be null");
        }

        if (userId == null || userId < 0) {
            logger.warn("Invalid UserId: {}", userId);
            throw new IllegalArgumentException("Invalid User ID");
        }

        if (!usrepo.existsById(userId)) {
            logger.warn("User not found with UserId: {}", userId);
            throw new UserNotfoundException(userId);
        }

        try {
            List<ExpenseDTO> results = expRepo.findByExpenseDateAndUserId(date, userId)
                    .stream().map(this::converttoDTO).collect(Collectors.toList());

            if (!results.isEmpty()) {
                logger.info("Expenses found for date: {} and userId: {}", date, userId);
            } else {
                logger.warn("No expenses found for date: {} and userId: {}", date, userId);
            }

            return results;
        } catch (Exception e) {
            throw new BusinessException("Error fetching expenses: " + e.getMessage());
        }
    }

    @Override
    public List<ExpenseDTO> getByMonthAndUser(int month, int year, Long userId) {
        if (month < 0) {
            logger.warn("Invalid Month: {}", month);
            throw new IllegalArgumentException("Invalid Month");
        }
        if (year < 0) {
            logger.warn("Invalid Year: {}", year);
            throw new IllegalArgumentException("Invalid Year");
        }
        if (userId == null || userId < 0) {
            logger.warn("Invalid User ID: {}", userId);
            throw new IllegalArgumentException("Invalid User ID");
        }

        if (!usrepo.existsById(userId)) {
            logger.warn("User not found with UserId: {}", userId);
            throw new UserNotfoundException(userId);
        }

        try {
            List<ExpenseDTO> results = expRepo.findByMonthAndUserId(month, year, userId)
                    .stream().map(this::converttoDTO).collect(Collectors.toList());

            if (!results.isEmpty()) {
                logger.info("Expenses found for month/year: {}/{} and userId: {}", month, year, userId);
            } else {
                logger.warn("No expenses found for month/year: {}/{} and userId: {}", month, year, userId);
            }

            return results;
        } catch (Exception e) {
            throw new BusinessException("Error fetching expenses: " + e.getMessage());
        }
    }

    @Override
    public List<ExpenseDTO> getByYearAndUser(int year, Long userId) {
        if (year < 0) {
            logger.warn("Invalid Year: {}", year);
            throw new IllegalArgumentException("Invalid year");
        }
        if (userId == null || userId < 0) {
            logger.warn("Invalid User ID: {}", userId);
            throw new IllegalArgumentException("Invalid User ID");
        }

        if (!usrepo.existsById(userId)) {
            logger.warn("User not found with UserId: {}", userId);
            throw new UserNotfoundException(userId);
        }

        try {
            List<ExpenseDTO> results = expRepo.findByYearAndUserId(year, userId)
                    .stream().map(this::converttoDTO).collect(Collectors.toList());

            if (!results.isEmpty()) {
                logger.info("Expenses found for year: {} and userId: {}", year, userId);
            } else {
                logger.warn("No expenses found for year: {} and userId: {}", year, userId);
            }

            return results;
        } catch (Exception e) {
            throw new BusinessException("Error fetching yearly expenses: " + e.getMessage());
        }
    }

    @Override
    public ExpenseDTO getByIdandUser(Long id, Long user_id) {
        if (id == null || id < 0) {
            logger.warn("Invalid Expense ID: {}", id);
            throw new IllegalArgumentException("Invalid Expense Id");
        }

        if (user_id == null || user_id < 0) {
            logger.warn("Invalid User ID: {}", user_id);
            throw new IllegalArgumentException("Invalid User_id");
        }

        if (!usrepo.existsById(user_id)) {
            logger.warn("User not found with UserId: {}", user_id);
            throw new UserNotfoundException(user_id);
        }

        try {
            ExpenseDTO result = converttoDTO(expRepo.findByIdAndUserId(id, user_id));
            if (result == null) {
                logger.warn("No Expense found for id: {} and userId: {}", id, user_id);
            } else {
                logger.info("Expense found for id: {} and userId: {}", id, user_id);
            }
            return result;
        } catch (Exception e) {
            throw new BusinessException("Error fetching expense: " + e.getMessage());
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

    @Override
    public List<ExpenseDTO> getbyUserid(Long userId) {
        if (userId == null || userId < 0) {
            logger.warn("Invalid UserId: {}", userId);
            throw new IllegalArgumentException("Invalid UserId");
        }

        if (!usrepo.existsById(userId)) {
            logger.warn("No user found with UserId: {}", userId);
            throw new UserNotfoundException(userId);
        }

        try {
            List<ExpenseDTO> results = expRepo.findByUserId(userId)
                    .stream().map(this::converttoDTO).collect(Collectors.toList());

            if (!results.isEmpty()) {
                logger.info("Expenses found for userId: {}", userId);
            } else {
                logger.warn("No expenses found for userId: {}", userId);
            }

            return results;
        } catch (Exception e) {
            throw new BusinessException("Error fetching expenses for user: " + e.getMessage());
        }
    }

    @Override
    public ExpenseDTO updateExpense(Long id, ExpenseDTO expenseDto, Long userId) {
        if (id == null || id < 0) {
            logger.warn("Invalid Expense ID: {}", id);
            throw new IllegalArgumentException("Invalid Expense Id");
        }
        if (userId == null || userId < 0) {
            logger.warn("Invalid User ID: {}", userId);
            throw new IllegalArgumentException("Invalid User_id");
        }
        if (!usrepo.existsById(userId)) {
            logger.warn("User not found with UserId: {}", userId);
            throw new UserNotfoundException(userId);
        }
        Expense expense = expRepo.findByIdAndUserId(id, userId);
        if (expense == null) {
            throw new ResourceNotFoundException("Expense not found with ID: " + id, id);
        }
        // Update fields
        expense.setAmount(expenseDto.getAmount());
        expense.setCategory(expenseDto.getCategory());
        expense.setDescription(expenseDto.getDescription());
        expense.setExpenseDate(expenseDto.getExpenseDate());
        // Save and return updated DTO
        Expense updated = expRepo.save(expense);
        return converttoDTO(updated);
    }

    @Override
    public List<ExpenseDTO> getByMonthsAndUser(List<Integer> months, int year, Long userId) {
        if (months == null || months.isEmpty()) {
            logger.warn("Months list cannot be null or empty.");
            throw new IllegalArgumentException("Months list cannot be null or empty");
        }
        if (year < 0) {
            logger.warn("Invalid Year: {}", year);
            throw new IllegalArgumentException("Invalid Year");
        }
        if (userId == null || userId < 0) {
            logger.warn("Invalid User ID: {}", userId);
            throw new IllegalArgumentException("Invalid User ID");
        }
        if (!usrepo.existsById(userId)) {
            logger.warn("User not found with UserId: {}", userId);
            throw new UserNotfoundException(userId);
        }
        try {
            List<Expense> all = expRepo.findByUserId(userId);
            List<ExpenseDTO> results = all.stream()
                .filter(e -> months.contains(e.getExpenseDate().getMonthValue()) && e.getExpenseDate().getYear() == year)
                .map(this::converttoDTO)
                .collect(Collectors.toList());
            if (!results.isEmpty()) {
                logger.info("Expenses found for months: {} in year: {} and userId: {}", months, year, userId);
            } else {
                logger.warn("No expenses found for months: {} in year: {} and userId: {}", months, year, userId);
            }
            return results;
        } catch (Exception e) {
            throw new BusinessException("Error fetching expenses: " + e.getMessage());
        }
    }

    @Override
    public List<ExpenseDTO> getByMonthRangeAndUser(int start, int end, int year, Long userId) {
        if (start < 1 || start > 12 || end < 1 || end > 12 || start > end) {
            logger.warn("Invalid month range: {}-{}", start, end);
            throw new IllegalArgumentException("Invalid month range");
        }
        if (year < 0) {
            logger.warn("Invalid Year: {}", year);
            throw new IllegalArgumentException("Invalid Year");
        }
        if (userId == null || userId < 0) {
            logger.warn("Invalid User ID: {}", userId);
            throw new IllegalArgumentException("Invalid User ID");
        }
        if (!usrepo.existsById(userId)) {
            logger.warn("User not found with UserId: {}", userId);
            throw new UserNotfoundException(userId);
        }
        try {
            List<Expense> all = expRepo.findByUserId(userId);
            List<ExpenseDTO> results = all.stream()
                .filter(e -> {
                    int m = e.getExpenseDate().getMonthValue();
                    return m >= start && m <= end && e.getExpenseDate().getYear() == year;
                })
                .map(this::converttoDTO)
                .collect(Collectors.toList());
            if (!results.isEmpty()) {
                logger.info("Expenses found for month range: {}-{} in year: {} and userId: {}", start, end, year, userId);
            } else {
                logger.warn("No expenses found for month range: {}-{} in year: {} and userId: {}", start, end, year, userId);
            }
            return results;
        } catch (Exception e) {
            throw new BusinessException("Error fetching expenses: " + e.getMessage());
        }
    }
}
