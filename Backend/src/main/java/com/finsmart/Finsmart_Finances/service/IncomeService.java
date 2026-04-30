package com.finsmart.Finsmart_Finances.service;

import com.finsmart.Finsmart_Finances.dto.IncomeDTO;
import com.finsmart.Finsmart_Finances.model.User;

public interface IncomeService {
    IncomeDTO getIncomeByUser(Long userId);
    IncomeDTO setOrUpdateIncome(Long userId, double amount);
    User findUserByUsername(String username);
} 