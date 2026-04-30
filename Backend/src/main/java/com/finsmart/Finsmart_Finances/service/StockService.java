package com.finsmart.Finsmart_Finances.service;

import java.util.List;
import java.util.Optional;

import com.finsmart.Finsmart_Finances.model.Stock;

public interface StockService {
    Stock saveStock(Stock stock);
    List<Stock> getAllStocks();
    Optional<Stock> getStockById(Long id);
    
    void deleteStock(Long id);
}
