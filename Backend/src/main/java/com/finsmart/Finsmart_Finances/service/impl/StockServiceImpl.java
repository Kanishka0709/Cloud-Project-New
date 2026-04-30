package com.finsmart.Finsmart_Finances.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.finsmart.Finsmart_Finances.model.Stock;
import com.finsmart.Finsmart_Finances.repository.StockRepository;
import com.finsmart.Finsmart_Finances.service.StockService;

@Service
public class StockServiceImpl implements StockService {

    private final StockRepository stockRepo;

    public StockServiceImpl(StockRepository stockRepo) {
        this.stockRepo = stockRepo;
    }

    @Override
    public Stock saveStock(Stock stock) {
        return stockRepo.save(stock);
    }

    @Override
    public List<Stock> getAllStocks() {
        return stockRepo.findAll();
    }

    @Override
    public Optional<Stock> getStockById(Long id) {
        return stockRepo.findById(id);
    }

    

    @Override
    public void deleteStock(Long id) {
        stockRepo.deleteById(id);
    }
}
