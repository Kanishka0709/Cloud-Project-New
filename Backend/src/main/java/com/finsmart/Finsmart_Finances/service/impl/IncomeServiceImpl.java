package com.finsmart.Finsmart_Finances.service.impl;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.finsmart.Finsmart_Finances.dto.IncomeDTO;
import com.finsmart.Finsmart_Finances.model.Income;
import com.finsmart.Finsmart_Finances.model.User;
import com.finsmart.Finsmart_Finances.repository.IncomeRepository;
import com.finsmart.Finsmart_Finances.repository.UserRepository;
import com.finsmart.Finsmart_Finances.service.IncomeService;

@Service
public class IncomeServiceImpl implements IncomeService {
    private final IncomeRepository incomeRepo;
    private final UserRepository userRepo;
    private final ModelMapper modelMapper;
    private static final Logger logger = LoggerFactory.getLogger(IncomeServiceImpl.class);

    public IncomeServiceImpl(IncomeRepository incomeRepo, UserRepository userRepo, ModelMapper modelMapper) {
        this.incomeRepo = incomeRepo;
        this.userRepo = userRepo;
        this.modelMapper = modelMapper;
    }

    public IncomeDTO convertToDTO(Income income) {
        if (income == null) return null;
        return new IncomeDTO(income.getId(), income.getAmount(), income.getUser().getId());
    }

    @Override
    public IncomeDTO getIncomeByUser(Long userId) {
        Income income = incomeRepo.findByUserId(userId);
        return convertToDTO(income);
    }

    @Override
    public IncomeDTO setOrUpdateIncome(Long userId, double amount) {
        Income income = incomeRepo.findByUserId(userId);
        User user = userRepo.findById(userId).orElseThrow();
        if (income == null) {
            income = new Income();
            income.setUser(user);
        }
        income.setAmount(amount);
        Income saved = incomeRepo.save(income);
        logger.info("Income set/updated for user {}: {}", userId, amount);
        return convertToDTO(saved);
    }

    @Override
    public User findUserByUsername(String username) {
        if (username == null) throw new IllegalArgumentException("Username cannot be null");
        return userRepo.findByUsername(username);
    }
} 