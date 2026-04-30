package com.finsmart.Finsmart_Finances.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.finsmart.Finsmart_Finances.dto.StockTransactionDTO;
import com.finsmart.Finsmart_Finances.model.Stock;
import com.finsmart.Finsmart_Finances.model.StockTransaction;
import com.finsmart.Finsmart_Finances.repository.StockRepository;
import com.finsmart.Finsmart_Finances.repository.StockTransactionRepository;
import com.finsmart.Finsmart_Finances.service.StockTransactionService;


@Service
public class StockTransactionServiceimpl implements StockTransactionService{
	
	private StockTransactionRepository stocktransrepo;
	private StockRepository stockrepo;
	private ModelMapper MM;
	

	@Autowired
	public StockTransactionServiceimpl(StockTransactionRepository stocktransrepo, StockRepository stockrepo,
			ModelMapper mM) {
		super();
		this.stocktransrepo = stocktransrepo;
		this.stockrepo = stockrepo;
		MM = mM;
	}
	
	public StockTransactionDTO converttoDTO(StockTransaction u) {
		return MM.map(u, StockTransactionDTO.class);
	}
	
	public StockTransaction converttoEntity(StockTransactionDTO dto) {
		return MM.map(dto, StockTransaction.class);
	}
	


	@Override
	public StockTransactionDTO addtransaction(StockTransaction s) {
	    Long stockId = s.getStock().getId();
	    Stock fullStock = stockrepo.findById(stockId)
	        .orElseThrow(() -> new RuntimeException("Stock not found with ID: " + stockId));

	    s.setStock(fullStock);
	    StockTransaction saved = stocktransrepo.save(s);
	    StockTransactionDTO savedDTO = converttoDTO(saved);
	    savedDTO.setCurrentPrice(fullStock.getCurrentPrice());
	    savedDTO.setSymbol(fullStock.getSymbol());

	    return savedDTO;
	}

	@Override
	public List<StockTransactionDTO> getalltrans() {
	    List<StockTransaction> ss = stocktransrepo.findAll();
	    List<StockTransactionDTO> ssDTO = new ArrayList<>();

	    for (StockTransaction s : ss) {
	        Long stockId = s.getStock().getId();
	        Stock fullStock = stockrepo.findById(stockId)
	            .orElseThrow(() -> new RuntimeException("Stock not found with ID: " + stockId));

	        StockTransactionDTO con = converttoDTO(s);
	        con.setCurrentPrice(fullStock.getCurrentPrice());
	        con.setSymbol(fullStock.getSymbol());

	        ssDTO.add(con);
	    }

	    return ssDTO;
	}

	@Override
	public Optional<StockTransactionDTO> getbyid(Long id) {
	    StockTransaction s = stocktransrepo.findById(id)
	        .orElseThrow(() -> new RuntimeException("StockTransaction not found with ID: " + id));

	    Long stockId = s.getStock().getId();
	    Stock fullStock = stockrepo.findById(stockId)
	        .orElseThrow(() -> new RuntimeException("Stock not found with ID: " + stockId));

	    StockTransactionDTO con = converttoDTO(s);
	    con.setCurrentPrice(fullStock.getCurrentPrice());
	    con.setSymbol(fullStock.getSymbol());

	    return Optional.of(con);
	}

	@Override
	public void deletebyid(long id) {
	    stocktransrepo.deleteById(id);
	}

	@Override
	public StockTransactionDTO updateTransaction(Long id, StockTransaction stockTransaction) {
	    StockTransaction existing = stocktransrepo.findById(id)
	        .orElseThrow(() -> new RuntimeException("StockTransaction not found with ID: " + id));
	    // Fetch the managed Stock entity
	    Long stockId = stockTransaction.getStock().getId();
	    Stock fullStock = stockrepo.findById(stockId)
	        .orElseThrow(() -> new RuntimeException("Stock not found with ID: " + stockId));
	    // Update fields
	    existing.setCurrentPrice(stockTransaction.getCurrentPrice());
	    existing.setPurchasePrice(stockTransaction.getPurchasePrice());
	    existing.setQuantity(stockTransaction.getQuantity());
	    existing.setTransactionDate(stockTransaction.getTransactionDate());
	    existing.setTransactionType(stockTransaction.getTransactionType());
	    existing.setStock(fullStock); // Attach managed entity
	    // Save and return updated DTO
	    StockTransaction updated = stocktransrepo.save(existing);
	    StockTransactionDTO updatedDTO = converttoDTO(updated);
	    updatedDTO.setCurrentPrice(fullStock.getCurrentPrice());
	    updatedDTO.setSymbol(fullStock.getSymbol());
	    return updatedDTO;
	}

}
