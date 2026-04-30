package com.finsmart.Finsmart_Finances.service;

import java.util.List;
import java.util.Optional;

import com.finsmart.Finsmart_Finances.dto.StockTransactionDTO;
import com.finsmart.Finsmart_Finances.model.StockTransaction;

public interface StockTransactionService {
	StockTransactionDTO addtransaction(StockTransaction s);
	List<StockTransactionDTO> getalltrans();
	Optional<StockTransactionDTO> getbyid(Long id);
	void deletebyid(long id);
	StockTransactionDTO updateTransaction(Long id, StockTransaction stockTransaction);
}
