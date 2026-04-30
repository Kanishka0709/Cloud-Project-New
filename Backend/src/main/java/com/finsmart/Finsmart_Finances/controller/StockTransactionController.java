package com.finsmart.Finsmart_Finances.controller;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finsmart.Finsmart_Finances.dto.StockTransactionDTO;
import com.finsmart.Finsmart_Finances.model.StockTransaction;
import com.finsmart.Finsmart_Finances.model.User;
import com.finsmart.Finsmart_Finances.repository.UserRepository;
import com.finsmart.Finsmart_Finances.service.StockTransactionService;

@RestController
@RequestMapping("/stock-transactions")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class StockTransactionController {

    private static final Logger logger = LoggerFactory.getLogger(StockTransactionController.class);
    private final StockTransactionService stockTransactionService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    public StockTransactionController(StockTransactionService stockTransactionService) {
        this.stockTransactionService = stockTransactionService;
    }

    // POST: Add new transaction
    @PostMapping
    public StockTransactionDTO createTransaction(@RequestBody StockTransaction stockTransaction, Authentication authen) {
        String username = authen.getName();
        User user = userRepository.findByUsername(username);
        stockTransaction.setUser(user);
        return stockTransactionService.addtransaction(stockTransaction);
    }

    // GET: Get all transactions
    @GetMapping
    public List<StockTransactionDTO> getAllTransactions() {
        return stockTransactionService.getalltrans();
    }

    // GET: Get transaction by ID
    @GetMapping("/{id}")
    public Optional<StockTransactionDTO> getTransactionById(@PathVariable Long id) {
        return stockTransactionService.getbyid(id);
    }

    // DELETE: Delete transaction by ID
    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        stockTransactionService.deletebyid(id);
    }

    @PutMapping("/{id}")
    public StockTransactionDTO updateTransaction(@PathVariable Long id, @RequestBody StockTransaction stockTransaction, Authentication authen) {
        String username = authen.getName();
        User user = userRepository.findByUsername(username);
        stockTransaction.setUser(user);
        return stockTransactionService.updateTransaction(id, stockTransaction);
    }
}
