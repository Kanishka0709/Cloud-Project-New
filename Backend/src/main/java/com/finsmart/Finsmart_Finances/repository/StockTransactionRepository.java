package com.finsmart.Finsmart_Finances.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finsmart.Finsmart_Finances.model.StockTransaction;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long>{

}
