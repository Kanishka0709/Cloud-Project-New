package com.finsmart.Finsmart_Finances.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finsmart.Finsmart_Finances.model.Stock;

public interface StockRepository extends JpaRepository<Stock, Long> {
    
}
