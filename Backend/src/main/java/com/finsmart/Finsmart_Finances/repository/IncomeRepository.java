package com.finsmart.Finsmart_Finances.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finsmart.Finsmart_Finances.model.Income;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    Income findByUserId(Long userId);
    boolean existsByUserId(Long userId);
} 