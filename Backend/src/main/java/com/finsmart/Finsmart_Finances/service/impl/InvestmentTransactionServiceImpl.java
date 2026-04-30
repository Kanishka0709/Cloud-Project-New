package com.finsmart.Finsmart_Finances.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.finsmart.Finsmart_Finances.dto.InvestmentTransactionDTO;
import com.finsmart.Finsmart_Finances.dto.InvestmentTransactionRequest;
import com.finsmart.Finsmart_Finances.model.InvestmentGoal;
import com.finsmart.Finsmart_Finances.model.InvestmentTransaction;
import com.finsmart.Finsmart_Finances.repository.InvestmentGoalRepository;
import com.finsmart.Finsmart_Finances.repository.InvestmentTransactionRepository;
import com.finsmart.Finsmart_Finances.service.InvestmentTransactionService;

@Service
public class InvestmentTransactionServiceImpl implements InvestmentTransactionService {

    private final InvestmentTransactionRepository repo;
    private final ModelMapper MM;
    private final InvestmentGoalRepository goalrepo;
    
    
    @Autowired
    public InvestmentTransactionServiceImpl(InvestmentTransactionRepository repo,ModelMapper mm, InvestmentGoalRepository goalrepo) {
        this.repo = repo;
        this.MM = mm;
        this.goalrepo = goalrepo;
    }
    
    public InvestmentTransactionDTO converttoDTO(InvestmentTransaction t) {
    	InvestmentTransactionDTO dto = MM.map(t, InvestmentTransactionDTO.class);
    	if (t.getGoal() != null) {
    		dto.setGoalId(t.getGoal().getId());
    	}
    	dto.setId(t.getId());
    	return dto;
    }
    
    public InvestmentTransaction converttoEntity(InvestmentTransactionDTO td ) {
    	return MM.map(td, InvestmentTransaction.class);
    }
    

    @Override
    public InvestmentTransactionDTO createTransaction(InvestmentTransactionRequest txReq) {
        try {
            System.out.println("Creating transaction with goalId: " + txReq.getGoalId());
            
            InvestmentGoal goal = goalrepo.findById(txReq.getGoalId())
                .orElseThrow(() -> new RuntimeException("Goal not found with ID: " + txReq.getGoalId()));
            
            System.out.println("Found goal: " + goal.getGoalName());
            
            InvestmentTransaction transaction = new InvestmentTransaction();
            transaction.setAmount(txReq.getAmount());
            transaction.setMode(txReq.getMode());
            transaction.setDateTime(LocalDateTime.parse(txReq.getDateTime()));
            transaction.setNote(txReq.getNote());
            transaction.setGoal(goal);
            
            System.out.println("About to save transaction: " + transaction);
            
            InvestmentTransaction saved = repo.save(transaction);
            
            System.out.println("Transaction saved with ID: " + saved.getId());
            
            InvestmentTransactionDTO transactionDTO = converttoDTO(saved);
            transactionDTO.setGoalname(goal.getGoalName());
            transactionDTO.setGoalId(goal.getId());
            
            System.out.println("Returning transaction DTO: " + transactionDTO);
            
            return transactionDTO;
        } catch (Exception e) {
            System.err.println("Error creating transaction: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<InvestmentTransactionDTO> getAllTransactions() {
        List<InvestmentTransaction> trans_list = repo.findAll();
        List<InvestmentTransactionDTO> hh = new ArrayList<>(); 
        
        for(InvestmentTransaction t : trans_list) {
        	InvestmentGoal goal  = t.getGoal();
            InvestmentTransactionDTO transactionDTO = converttoDTO(t);
            transactionDTO.setGoalname(goal.getGoalName());
            transactionDTO.setGoalId(goal.getId());
            
            hh.add(transactionDTO);
        	
        }
        
        return hh;
    }

    @Override
    public List<InvestmentTransactionDTO> getAllTransactionsByUser(Long userId) {
        List<InvestmentTransaction> trans_list = repo.findByGoal_User_Id(userId);
        List<InvestmentTransactionDTO> hh = new ArrayList<>(); 
        
        for(InvestmentTransaction t : trans_list) {
        	InvestmentGoal goal  = t.getGoal();
            InvestmentTransactionDTO transactionDTO = converttoDTO(t);
            transactionDTO.setGoalname(goal.getGoalName());
            transactionDTO.setGoalId(goal.getId());
            
            hh.add(transactionDTO);
        	
        }
        
        return hh;
    }

    @Override
    public Optional<InvestmentTransactionDTO> getTransactionById(Long id) {
        InvestmentTransaction transaction = repo.findById(id).orElseThrow();
        InvestmentGoal goal = transaction.getGoal();
        InvestmentTransactionDTO transactionDTO = converttoDTO(transaction);
        transactionDTO.setGoalname(goal.getGoalName());
        transactionDTO.setGoalId(goal.getId());
        
        return Optional.ofNullable(transactionDTO);
        
    }

    @Override
    public InvestmentTransactionDTO updateTransaction(Long id, InvestmentTransactionDTO updatedTx) {
        InvestmentTransaction existing = repo.findById(id).orElseThrow();
        if (updatedTx.getAmount() != null) existing.setAmount(updatedTx.getAmount());
        if (updatedTx.getMode() != null) existing.setMode(updatedTx.getMode());
        if (updatedTx.getDateTime() != null) existing.setDateTime(updatedTx.getDateTime());
        if (updatedTx.getNote() != null) existing.setNote(updatedTx.getNote());
        // Optionally update goal if needed
        InvestmentTransaction saved = repo.save(existing);
        return converttoDTO(saved);
    }

    @Override
    public void deleteTransaction(Long id) {
        repo.deleteById(id);
    }

    @Override
    public void deleteTransactionsByGoalId(Long goalId) {
        List<InvestmentTransaction> transactions = repo.findByGoal_Id(goalId);
        repo.deleteAll(transactions);
    }

	
}
