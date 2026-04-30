package com.finsmart.Finsmart_Finances.controller;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finsmart.Finsmart_Finances.model.Stock;
import com.finsmart.Finsmart_Finances.model.User;
import com.finsmart.Finsmart_Finances.repository.UserRepository;
import com.finsmart.Finsmart_Finances.service.StockService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/stocks")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class StockController {

    private static final Logger logger = LoggerFactory.getLogger(StockController.class);
    private final StockService stockService;
    private final UserRepository userRepository;

    public StockController(StockService stockService, UserRepository userRepository) {
        this.stockService = stockService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public Stock save(@Valid @RequestBody Stock stock, Principal principal) {
        String username = principal.getName();
        User user = userRepository.findByUsername(username);
        stock.setUser(user);
        return stockService.saveStock(stock);
    }

    @GetMapping
    public List<Stock> getAll() {
        return stockService.getAllStocks();
    }

    @GetMapping("/{id}")
    public Optional<Stock> getById(@PathVariable Long id) {
        return stockService.getStockById(id);
    }

    @PutMapping("/{id}")
    public Stock update(@PathVariable Long id, @Valid @RequestBody Stock stock, Principal principal) {
        String username = principal.getName();
        User user = userRepository.findByUsername(username);
        stock.setId(id);
        stock.setUser(user); // Set the user before saving
        return stockService.saveStock(stock);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        stockService.deleteStock(id);
    }
}
